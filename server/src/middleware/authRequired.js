import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Admin access token is required." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "dev_access_secret");
    return next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired admin access token." });
  }
}

export function adminRequired(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin role is required." });
  }

  return next();
}
