import type { SignupInput } from "@/validations/auth.validation";
import { CTError } from "@/utils/errHandler.util";
import { db, DrizzleQueryError, eq, models } from "@repo/db-config";

export class UserService {
  static async createUser({ name, email, password, role }: SignupInput) {
    try {
      const [user] = await db
        .insert(models.users)
        .values({
          name,
          email,
          passwordHash: password,
          role,
        })
        .returning({
          id: models.users.id,
          name: models.users.name,
          email: models.users.email,
          role: models.users.role,
          createdAt: models.users.createdAt,
        });

      return user;
    } catch (err) {
      if (
        err instanceof DrizzleQueryError &&
        err.cause &&
        "code" in err.cause &&
        err.cause.code === "23505"
      ) {
        throw new CTError(
          409,
          "Email already registered. Please sign in or use another email.",
        );
      }
      throw err;
    }
  }

  static async getUser(email: string) {
    const [user] = await db
      .select({
        id: models.users.id,
        name: models.users.name,
        email: models.users.email,
        passwordHash: models.users.passwordHash,
        role: models.users.role,
      })
      .from(models.users)
      .where(eq(models.users.email, email))
      .limit(1);

    return user ?? null;
  }

  static async getUserById(id: number) {
    const [user] = await db
      .select({
        id: models.users.id,
        name: models.users.name,
        email: models.users.email,
        role: models.users.role,
        createdAt: models.users.createdAt,
      })
      .from(models.users)
      .where(eq(models.users.id, id))
      .limit(1);

    return user ?? null;
  }
}
