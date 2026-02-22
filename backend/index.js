import "dotenv/config";
import express from "express";
import { query, testConnection } from "./db.js";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportsRoutes from "./routes/reports.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080,http://127.0.0.1:8080,http://localhost:8082,http://127.0.0.1:8082,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "2cents API", status: "ok" });
});

app.get("/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const ok = await testConnection();
  if (ok) console.log("Database: connected to twocents");
  else console.warn("Database: connection failed — check .env (user, password, host, port) and that PostgreSQL is running.");
});
