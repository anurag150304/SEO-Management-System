import type {
  CreateSchemaInput,
  SupportedSchemaType,
} from "@repo/zod-validations";
import type {
  SchemasListResponse,
  SchemaSingleResponse,
  SchemaDeleteResponse,
} from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/schema.type";

export const schemaClient = {
  getAllSchemas: async (): Promise<SchemasListResponse> => {
    try {
      const res = await apiClient.get<SchemasListResponse>("/schemas");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getSchemaByType: async (
    schemaType: SupportedSchemaType | string,
  ): Promise<SchemaSingleResponse> => {
    try {
      const res = await apiClient.get<SchemaSingleResponse>(
        `/schemas/${schemaType}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createSchema: async (
    payload: CreateSchemaInput,
  ): Promise<SchemaSingleResponse> => {
    try {
      const res = await apiClient.post<SchemaSingleResponse>(
        "/schemas",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateSchema: async (
    schemaType: SupportedSchemaType | string,
    schemaData: unknown,
  ): Promise<SchemaSingleResponse> => {
    try {
      const res = await apiClient.put<SchemaSingleResponse>(
        `/schemas/${schemaType}`,
        { schemaData },
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  deleteSchema: async (
    schemaType: SupportedSchemaType | string,
  ): Promise<SchemaDeleteResponse> => {
    try {
      const res = await apiClient.delete<SchemaDeleteResponse>(
        `/schemas/${schemaType}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
