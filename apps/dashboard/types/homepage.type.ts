import type { HomepageRecord } from "@repo/db-config";

export interface HomepageResponse {
  message: string;
  homepage: HomepageRecord;
}
