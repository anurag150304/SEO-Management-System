import type { ContactSettingsRecord } from "@repo/db-config";

export interface ContactResponse {
  message: string;
  contactSettings: ContactSettingsRecord;
}
