import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "@repo/zod-validations";
import { UserService } from "@/services/user.service";
import {
  comparePassword,
  extractToken,
  generateToken,
  getAuthCookieOptions,
  hashPassword,
  insertToken,
} from "../utils/auth.utils";
import { CTError } from "@/utils/errHandler.util";
import { formatZodErrors } from "@/utils/zodErrors";

export class AuthController {
  static async signup(req: Request, res: Response) {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const hashedPassword = await hashPassword(parsedData.data.password);
    const user = await UserService.createUser({
      ...parsedData.data,
      password: hashedPassword,
    });

    if (!user) {
      throw new CTError(400, "Something went wrong while creating user!");
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.cookie("auth_token", token, getAuthCookieOptions());

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  static async signin(req: Request, res: Response) {
    const parsedData = signinSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const user = await UserService.getUser(parsedData.data.email);
    if (!user) {
      throw new CTError(401, "Invalid email or password.");
    }

    // FIX: Await password comparison to prevent authentication bypass
    const isPassMatched = await comparePassword(
      parsedData.data.password,
      user.passwordHash,
    );

    if (!isPassMatched) {
      throw new CTError(401, "Invalid email or password.");
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.cookie("auth_token", token, getAuthCookieOptions());

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  static async profile(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw new CTError(401, "Authentication failed!");
    }

    return res.status(200).json(user);
  }

  static async signout(req: Request, res: Response) {
    const token = extractToken(req);

    if (token) {
      await insertToken(token);
    }

    res.clearCookie("auth_token", { path: "/" });

    return res.status(200).json({
      success: true
    });
  }
}
