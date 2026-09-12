import type {
  createSeoSchemaType,
  updateSeoSchemaType,
} from "@repo/zod-validations";
import type { SeoResponse } from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/seo_.metadata.type";

export type CreateSeoPayload = createSeoSchemaType | FormData;
export type UpdateSeoPayload = updateSeoSchemaType | FormData;

export const seoClient = {
  getSeo: async (id?: number): Promise<SeoResponse> => {
    try {
      const url = id ? `/seo/${id}` : "/seo";
      const res = await apiClient.get<SeoResponse>(url);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createSeo: async (payload: CreateSeoPayload): Promise<SeoResponse> => {
    try {
      const res = await apiClient.post<SeoResponse>("/seo/create", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateSeo: async (
    payload: UpdateSeoPayload,
    id?: number,
  ): Promise<SeoResponse> => {
    try {
      const url = id ? `/seo/${id}` : "/seo/update";
      const res = await apiClient.post<SeoResponse>(url, payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};

export default seoClient;
