import type { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { extractToken, findToken, verifyToken } from "../utils/auth.utils";

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "No auth token provided!" });
    }

    const isBlacklisted = await findToken(token);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ error: "Token has been invalidated. Please log in again." });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid auth token payload!" });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ error: "Auth token has expired. Please log in again." });
    }

    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid auth token!" });
    }

    console.error("Unexpected auth error: ", err);
    return res
      .status(401)
      .json({ error: "Something went wrong while validating auth token!" });
  }
}

/**
 * Middleware to restrict route access to specific roles.
 */
export function requireRole(...allowedRoles: ("ADMIN" | "EDITOR")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden. You do not have permission to perform this action.",
      });
    }

    return next();
  };
}
