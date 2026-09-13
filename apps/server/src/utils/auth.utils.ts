import { db, eq, models, DrizzleQueryError } from "@repo/db-config";
import { env } from "@repo/env-config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, CookieOptions } from "express";
import type { AuthUserPayload } from "@/express";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const hashPasshword = hashPassword;

export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

export const generateToken = (payload: AuthUserPayload): string => {
  const cleanPayload: AuthUserPayload = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
  return jwt.sign(cleanPayload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): AuthUserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
};

export const findToken = async (token: string): Promise<boolean> => {
  const count = await db.$count(
    models.blacklistedTokens,
    eq(models.blacklistedTokens.token, token),
  );
  return Boolean(count);
};

export const insertToken = async (token: string): Promise<boolean> => {
  try {
    const [inserted] = await db
      .insert(models.blacklistedTokens)
      .values({ token })
      .returning({ id: models.blacklistedTokens.id });
    return Boolean(inserted);
  } catch (err) {
    if (
      err instanceof DrizzleQueryError &&
      err.cause &&
      "code" in err.cause &&
      err.cause.code === "23505"
    ) {
      return true;
    }
    throw err;
  }
};

export const extractToken = (req: Request): string | null => {
  if (req.cookies?.auth_token) {
    return req.cookies.auth_token;
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7).trim();
    }
    return authHeader.trim();
  }

  return null;
};

export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === "production";
  return {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};
