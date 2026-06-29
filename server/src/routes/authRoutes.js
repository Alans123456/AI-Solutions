import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { all, get, run } from "../db/sqlite.js";
import { adminRequired, authRequired } from "../middleware/authRequired.js";

export const authRoutes = express.Router();

function tokensFor(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "dev_access_secret", {
    expiresIn: "2h"
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "dev_refresh_secret", {
    expiresIn: "7d"
  });
  return { accessToken, refreshToken };
}

authRoutes.post("/register", (_req, res) => {
  return res.status(403).json({ message: "Public signup is disabled. Users must be created by an admin." });
});

authRoutes.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials." });

    return res.json(tokensFor(user));
  } catch (error) {
    return next(error);
  }
});

authRoutes.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token is required." });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev_refresh_secret");
    const user = await get("SELECT id, email, role FROM users WHERE id = ?", [payload.id]);
    if (!user) return res.status(401).json({ message: "User no longer exists." });
    return res.json(tokensFor(user));
  } catch {
    return res.status(403).json({ message: "Invalid refresh token." });
  }
});

authRoutes.post("/logout", authRequired, (_req, res) => {
  return res.json({ success: true, message: "Logged out." });
});

authRoutes.get("/users", authRequired, adminRequired, async (_req, res, next) => {
  try {
    const users = await runSelectUsers();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

authRoutes.post("/users", authRequired, adminRequired, async (req, res, next) => {
  try {
    const { email, password, role = "user" } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or user." });
    }

    const existing = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const id = uuid();
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    await run(
      "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
      [id, email, passwordHash, role, now]
    );

    return res.status(201).json({ user: { id, email, role, createdAt: now } });
  } catch (error) {
    return next(error);
  }
});

authRoutes.put("/users/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    const current = await get("SELECT id, email, role FROM users WHERE id = ?", [req.params.id]);
    if (!current) return res.status(404).json({ message: "User not found." });

    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or user." });
    }

    const nextEmail = email || current.email;
    const nextRole = role || current.role;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 12);
      await run("UPDATE users SET email = ?, role = ?, password_hash = ? WHERE id = ?", [
        nextEmail,
        nextRole,
        passwordHash,
        req.params.id
      ]);
    } else {
      await run("UPDATE users SET email = ?, role = ? WHERE id = ?", [nextEmail, nextRole, req.params.id]);
    }

    return res.json({ user: { id: req.params.id, email: nextEmail, role: nextRole }, success: true });
  } catch (error) {
    return next(error);
  }
});

authRoutes.delete("/users/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const result = await run("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (!result.changes) return res.status(404).json({ message: "User not found." });

    return res.json({ success: true, message: "User deleted." });
  } catch (error) {
    return next(error);
  }
});

async function runSelectUsers() {
  const rows = await all("SELECT id, email, role, created_at FROM users ORDER BY datetime(created_at) DESC");
  return rows.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.created_at
  }));
}
