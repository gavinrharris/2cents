import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

const aiResponses = [
  "Based on your spending patterns, I'd recommend reducing dining out by one meal per week. That could save you around $60/month.",
  "Your savings rate is currently 19% — great job! Aim for 20% and you'll hit your emergency fund goal by August.",
  "I notice your grocery spending increased 12% this month. Consider meal planning on Sundays to stay on track.",
  "Have you considered refinancing your car loan? Current rates might save you $40/month.",
  "Your rent-to-income ratio is 28%, which is healthy. Nice work keeping housing costs manageable!",
];

router.post("/", (req, res) => {
  const { message } = req.body;
  const text = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  res.json({ reply: text });
});

export default router;
