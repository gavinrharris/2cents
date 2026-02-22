import { Router } from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

// GET /api/dashboard/stats – income, estimated expenses, savings rate for current user
router.get("/stats", async (req, res) => {
  try {
    const { email } = req.user;
    const profile = await query(
      "SELECT p.BudgetID, p.SavingsID FROM Profile p WHERE p.Email = $1",
      [email]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const { budgetid, savingsid } = profile.rows[0];
    let income = 0;
    let carPayment = 0;
    let rent = 0;
    let gas = 0;
    let weeklyGrocery = 0;
    let eatingOutPerWeek = 0;
    if (budgetid) {
      const b = await query(
        "SELECT Income, CarPayment, Rent, Gas, WeeklyGrocery, EatingOutPerWeek FROM MonthlyBudget WHERE BudgetID = $1",
        [budgetid]
      );
      const row = b.rows[0];
      if (row) {
        income = Number(row.income);
        carPayment = Number(row.carpayment);
        rent = Number(row.rent);
        gas = Number(row.gas);
        weeklyGrocery = Number(row.weeklygrocery);
        eatingOutPerWeek = Number(row.eatingoutperweek);
      }
    }
    const estimatedExpenses = rent + carPayment + gas + (weeklyGrocery * 4) + (eatingOutPerWeek * 50);
    const savingsRate = income > 0 ? Math.round((1 - estimatedExpenses / income) * 100) : 0;

    let currentSavings = 0;
    let desiredSavings = 0;
    if (savingsid) {
      const s = await query("SELECT CurrentSavings, DesiredSavings FROM Savings WHERE SavingsID = $1", [savingsid]);
      if (s.rows[0]) {
        currentSavings = Number(s.rows[0].currentsavings);
        desiredSavings = Number(s.rows[0].desiredsavings);
      }
    }

    res.json({
      monthlyIncome: income,
      estimatedMonthlyExpenses: Math.round(estimatedExpenses),
      savingsRate: Math.min(100, Math.max(0, savingsRate)),
      currentSavings,
      desiredSavings,
    });
  } catch (err) {
    console.error("GET /api/dashboard/stats error:", err);
    res.status(500).json({ error: "Failed to load stats", message: err.message });
  }
});

export default router;
