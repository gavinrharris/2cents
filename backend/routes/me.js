import { Router } from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

function rowToProfile(row, budget, savings, spender) {
  const firstName = row?.firstname ?? "";
  const lastName = row?.lastname ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "";
  return {
    userId: row?.userid,
    email: row?.email,
    fullName,
    firstName,
    lastName,
    state: row?.state ?? "",
    monthlyIncome: budget ? Number(budget.income) : 0,
    monthlyRent: budget ? Number(budget.rent) : 0,
    carPayment: budget ? Number(budget.carpayment) : 0,
    weeklyGrocery: budget ? Number(budget.weeklygrocery) : 0,
    eatingOutPerWeek: budget ? Number(budget.eatingoutperweek) : 0,
    recurringExpenses: budget?.recurringexpenses ?? "",
    personality: spender?.typename?.toLowerCase().includes("spontaneous") ? "spontaneous" : "planner",
    budgetId: row?.budgetid,
    savingsId: row?.savingsid,
    spenderId: row?.spenderid,
    currentSavings: savings ? Number(savings.currentsavings) : 0,
    desiredSavings: savings ? Number(savings.desiredsavings) : 0,
    endDate: savings?.enddate,
    initialSavings: savings ? Number(savings.initialsavings) : 0,
  };
}

// GET /api/me – full profile with budget, savings, spender
router.get("/", async (req, res) => {
  try {
    const { email, userId } = req.user;
    const profile = await query(
      "SELECT UserID, Email, FirstName, LastName, BudgetID, SavingsID, SpenderID, State FROM Profile WHERE Email = $1",
      [email]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const row = profile.rows[0];
    let budget = null;
    let savings = null;
    let spender = null;
    if (row.budgetid) {
      const b = await query(
        "SELECT Income, CarPayment, Rent, Gas, JobStabilityFlag, WeeklyGrocery, EatingOutPerWeek, RecurringExpenses FROM MonthlyBudget WHERE BudgetID = $1",
        [row.budgetid]
      );
      budget = b.rows[0] ?? null;
    }
    if (row.savingsid) {
      const s = await query(
        "SELECT CurrentSavings, DesiredSavings, EndDate, InitialSavings FROM Savings WHERE SavingsID = $1",
        [row.savingsid]
      );
      savings = s.rows[0] ?? null;
    }
    if (row.spenderid) {
      const sp = await query("SELECT TypeName, Description FROM Spender WHERE SpenderID = $1", [row.spenderid]);
      spender = sp.rows[0] ?? null;
    }
    const hasCompletedOnboarding = !!(row.firstname || row.lastname) && !!(budget && Number(budget.income) > 0);
    res.json({ profile: rowToProfile(row, budget, savings, spender), hasCompletedOnboarding });
  } catch (err) {
    console.error("GET /api/me error:", err);
    res.status(500).json({ error: "Failed to load profile", message: err.message });
  }
});

// PUT /api/me – update profile, budget, savings
router.put("/", async (req, res) => {
  try {
    const { email } = req.user;
    const body = req.body;
    const profile = await query(
      "SELECT UserID, BudgetID, SavingsID, SpenderID FROM Profile WHERE Email = $1",
      [email]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const { userid, budgetid, savingsid, spenderid } = profile.rows[0];

    const firstName = body.firstName ?? (body.fullName?.trim().split(/\s+/)[0] ?? "");
    const lastName = body.lastName ?? (body.fullName?.trim().split(/\s+/).slice(1).join(" ") ?? "");
    const newSpenderId = body.personality != null ? spenderIdForPersonality(body.personality) : spenderid;
    if (body.fullName !== undefined && body.firstName === undefined && body.lastName === undefined) {
      const parts = (body.fullName || "").trim().split(/\s+/);
      await query(
        "UPDATE Profile SET FirstName = $1, LastName = $2, State = $3, SpenderID = $4 WHERE Email = $5",
        [parts[0] || "", parts.slice(1).join(" ") || "", body.state ?? null, newSpenderId, email]
      );
    } else {
      await query(
        "UPDATE Profile SET FirstName = $1, LastName = $2, State = $3, SpenderID = $4 WHERE Email = $5",
        [firstName, lastName, body.state ?? null, newSpenderId, email]
      );
    }

    const income = body.monthlyIncome ?? body.income;
    const rent = body.monthlyRent ?? body.rent;
    const carPayment = body.carPayment ?? body.carPayment;
    if (budgetid && (income !== undefined || rent !== undefined || carPayment !== undefined || body.weeklyGrocery !== undefined || body.eatingOutPerWeek !== undefined || body.recurringExpenses !== undefined)) {
      const b = await query(
        "SELECT Income, CarPayment, Rent, Gas, WeeklyGrocery, EatingOutPerWeek, RecurringExpenses FROM MonthlyBudget WHERE BudgetID = $1",
        [budgetid]
      );
      const cur = b.rows[0] || {};
      await query(
        `UPDATE MonthlyBudget SET Income = COALESCE($1, Income), CarPayment = COALESCE($2, CarPayment), Rent = COALESCE($3, Rent),
         WeeklyGrocery = COALESCE($4, WeeklyGrocery), EatingOutPerWeek = COALESCE($5, EatingOutPerWeek), RecurringExpenses = COALESCE($6, RecurringExpenses) WHERE BudgetID = $7`,
        [
          income !== undefined ? income : cur.income,
          carPayment !== undefined ? carPayment : cur.carpayment,
          rent !== undefined ? rent : cur.rent,
          body.weeklyGrocery !== undefined ? body.weeklyGrocery : cur.weeklygrocery,
          body.eatingOutPerWeek !== undefined ? body.eatingOutPerWeek : cur.eatingoutperweek,
          body.recurringExpenses !== undefined ? body.recurringExpenses : cur.recurringexpenses,
          budgetid,
        ]
      );
    }

    if (savingsid && (body.currentSavings !== undefined || body.desiredSavings !== undefined || body.initialSavings !== undefined || body.endDate !== undefined)) {
      const s = await query("SELECT CurrentSavings, DesiredSavings, InitialSavings, EndDate FROM Savings WHERE SavingsID = $1", [savingsid]);
      const cur = s.rows[0] || {};
      await query(
        `UPDATE Savings SET CurrentSavings = COALESCE($1, CurrentSavings), DesiredSavings = COALESCE($2, DesiredSavings), InitialSavings = COALESCE($3, InitialSavings), EndDate = COALESCE($4, EndDate) WHERE SavingsID = $5`,
        [
          body.currentSavings ?? cur.currentsavings,
          body.desiredSavings ?? cur.desiredsavings,
          body.initialSavings ?? cur.initialsavings,
          body.endDate ?? cur.enddate,
          savingsid,
        ]
      );
    }

    const updated = await query(
      "SELECT UserID, Email, FirstName, LastName, BudgetID, SavingsID, SpenderID, State FROM Profile WHERE Email = $1",
      [email]
    );
    const row = updated.rows[0];
    const budget = row?.budgetid
      ? (await query("SELECT * FROM MonthlyBudget WHERE BudgetID = $1", [row.budgetid])).rows[0]
      : null;
    const savings = row?.savingsid
      ? (await query("SELECT * FROM Savings WHERE SavingsID = $1", [row.savingsid])).rows[0]
      : null;
    const spender = row?.spenderid
      ? (await query("SELECT * FROM Spender WHERE SpenderID = $1", [row.spenderid])).rows[0]
      : null;
    res.json({ profile: rowToProfile(row, budget, savings, spender), hasCompletedOnboarding: true });
  } catch (err) {
    console.error("PUT /api/me error:", err);
    res.status(500).json({ error: "Failed to update profile", message: err.message });
  }
});

function spenderIdForPersonality(personality) {
  if (personality === "spontaneous") return 3;
  if (personality === "planner") return 1;
  return 2;
}

export default router;
