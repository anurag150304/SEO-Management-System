import type { SchemaRecord } from "@repo/db-config";

export interface SchemasListResponse {
  message: string;
  count: number;
  schemas: SchemaRecord[];
}

export interface SchemaSingleResponse {
  message: string;
  schema: SchemaRecord;
}

export interface SchemaDeleteResponse {
  message: string;
  schemaType?: string;
  schemaId?: number;
}
