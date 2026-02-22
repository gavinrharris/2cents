import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../db.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

function parseName(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, recoveryEmail } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existing = await query("SELECT 1 FROM Login WHERE Email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO Login (Email, Password, RecoveryEmail) VALUES ($1, $2, $3)",
      [email, hashed, recoveryEmail || null]
    );

    const budget = await query(
      "INSERT INTO MonthlyBudget (Income, CarPayment, Rent, Gas, JobStabilityFlag, WeeklyGrocery, EatingOutPerWeek, RecurringExpenses) VALUES (0, 0, 0, 0, false, 0, 0, NULL) RETURNING BudgetID"
    );
    const savings = await query(
      "INSERT INTO Savings (CurrentSavings, DesiredSavings, EndDate, InitialSavings) VALUES (0, 0, NULL, 0) RETURNING SavingsID"
    );
    const spender = await query("SELECT SpenderID FROM Spender WHERE TypeName ILIKE $1 LIMIT 1", ["Moderate"]);
    const spenderId = spender.rows[0]?.SpenderID ?? 1;

    const profile = await query(
      "INSERT INTO Profile (Email, FirstName, LastName, BudgetID, SavingsID, SpenderID, State) VALUES ($1, '', '', $2, $3, $4, NULL) RETURNING UserID",
      [email, budget.rows[0].budgetid, savings.rows[0].savingsid, spenderId]
    );

    const userId = profile.rows[0].userid;
    const token = signToken({ email, userId });
    res.status(201).json({ token, email, userId, hasCompletedOnboarding: false });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed", message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const loginRow = await query("SELECT Email, Password FROM Login WHERE Email = $1", [email]);
    if (loginRow.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, loginRow.rows[0].password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const profile = await query(
      "SELECT UserID, Email, FirstName, LastName, BudgetID, SavingsID, SpenderID, State FROM Profile WHERE Email = $1",
      [email]
    );
    if (profile.rows.length === 0) {
      return res.status(500).json({ error: "Profile not found" });
    }
    const { userid, budgetid, savingsid, spenderid } = profile.rows[0];
    const token = signToken({ email, userId: userid });
    res.json({ token, email, userId: userid, budgetId: budgetid, savingsId: savingsid, spenderId: spenderid, hasCompletedOnboarding: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", message: err.message });
  }
});

export default router;
