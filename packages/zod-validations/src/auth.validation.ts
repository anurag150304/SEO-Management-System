import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(1, "Name cannot be empty.")
    .max(256, "Name must be no more than 256 characters."),

  email: z
    .email({ error: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),

  password: z
    .string({ error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(100, "Password must be no more than 100 characters long."),

  role: z
    .enum(["ADMIN", "EDITOR"], {
      error: "Role must be either ADMIN or EDITOR.",
    })
    .default("EDITOR"),
});

export const signinSchema = z.object({
  email: z
    .email({ error: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),

  password: z
    .string({ error: "Password is required." })
    .min(1, "Password cannot be empty.")
    .max(100, "Password must be no more than 100 characters long."),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
