import type { OccasionRecord } from "@repo/db-config";

export interface OccasionsListResponse {
  message: string;
  count: number;
  occasions: OccasionRecord[];
}

export interface OccasionSingleResponse {
  message: string;
  occasion: OccasionRecord;
}

export interface OccasionDeleteResponse {
  message: string;
  occasionId: number;
}

export interface OccasionReorderResponse {
  message: string;
  occasion?: OccasionRecord;
  occasions?: OccasionRecord[];
}
