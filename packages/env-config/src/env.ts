import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production"])
    .default("development"),

  PORT: z.coerce.number().optional(),
  JWT_SECRET: z.string(),
  BASE_PATH: z.string().default("/api/v1"),

  DASHBOARD_URL: z.url(),
  PUBLIC_URL: z.url(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  PROD_DB_URL: z.url(),
  LOCAL_DB_URL: z.url()
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
