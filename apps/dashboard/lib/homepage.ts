import type {
  CreateHomepageInput,
  UpdateHomepageInput,
} from "@repo/zod-validations";
import type { HomepageResponse } from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/homepage.type";

export const homepageClient = {
  getHomepage: async (id?: number): Promise<HomepageResponse> => {
    try {
      const url = id ? `/homepage/${id}` : "/homepage";
      const res = await apiClient.get<HomepageResponse>(url);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createHomepage: async (
    payload: CreateHomepageInput | FormData,
  ): Promise<HomepageResponse> => {
    try {
      const res = await apiClient.post<HomepageResponse>("/homepage", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateHomepage: async (
    payload: UpdateHomepageInput | FormData,
    id?: number,
  ): Promise<HomepageResponse> => {
    try {
      const url = id ? `/homepage/${id}` : "/homepage";
      const res = await apiClient.put<HomepageResponse>(url, payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
