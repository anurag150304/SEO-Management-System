import { env } from "@repo/env-config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.NODE_ENV === "production" ?
    env.PROD_DB_URL : env.LOCAL_DB_URL,
});
export const db = drizzle({ client: pool });
