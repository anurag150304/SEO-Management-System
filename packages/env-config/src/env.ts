import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8000),

  BASE_URL: z.url(),
  BASE_PATH: z.string().default("/api/v1"),
  DASHBOARD_URL: z.url(),
  PUBLIC_URL: z.url(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  JWT_SECRET: z.string(),
  DATABASE_URL: z.url(),
});

export type EnvType = z.infer<typeof envSchema>;

let cachedEnv: EnvType | null = null;
const loadEnv = (): EnvType => {
  if (cachedEnv) return cachedEnv;

  const parsedEnv = envSchema.safeParse(process.env);
  const { data, success, error } = parsedEnv;

  if (!success) {
    const errors = Object.keys(error.flatten().fieldErrors);
    console.error(
      "Check these Environment Variables: ",
      JSON.stringify(errors, null, 2),
    );
    process.exit(1);
  }

  cachedEnv = data;
  return cachedEnv;
};

export const env = loadEnv();
export default env;
