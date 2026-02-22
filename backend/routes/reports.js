import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

const spendingTrend = [
  { month: "Sep", amount: 3200 },
  { month: "Oct", amount: 2900 },
  { month: "Nov", amount: 3400 },
  { month: "Dec", amount: 3800 },
  { month: "Jan", amount: 3100 },
  { month: "Feb", amount: 2750 },
];

const spendingBreakdown = [
  { category: "Rent", amount: 1800, fill: "hsl(152, 44%, 49%)" },
  { category: "Groceries", amount: 480, fill: "hsl(220, 20%, 30%)" },
  { category: "Dining Out", amount: 320, fill: "hsl(152, 44%, 65%)" },
  { category: "Car", amount: 350, fill: "hsl(220, 14%, 50%)" },
  { category: "Subscriptions", amount: 65, fill: "hsl(152, 44%, 40%)" },
  { category: "Other", amount: 420, fill: "hsl(220, 14%, 70%)" },
];

const savingsTrend = [
  { month: "Sep", saved: 800 },
  { month: "Oct", saved: 1100 },
  { month: "Nov", saved: 600 },
  { month: "Dec", saved: 200 },
  { month: "Jan", saved: 900 },
  { month: "Feb", saved: 1250 },
];

const dailyTips = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Cancel one unused subscription this week — the savings add up fast.",
  "Pack lunch twice this week to save ~$30.",
  "Set up automatic transfers to savings on payday.",
  "Review your last 5 impulse purchases — would you buy them again?",
];

router.get("/spending-trend", (req, res) => {
  res.json(spendingTrend);
});

router.get("/spending-breakdown", (req, res) => {
  res.json(spendingBreakdown);
});

router.get("/savings-trend", (req, res) => {
  res.json(savingsTrend);
});

router.get("/daily-tips", (req, res) => {
  res.json(dailyTips);
});

export default router;
