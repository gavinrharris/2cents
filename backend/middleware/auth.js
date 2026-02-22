import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized", message: "Missing or invalid token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { email: decoded.email, userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
  }
}

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...options });
}
