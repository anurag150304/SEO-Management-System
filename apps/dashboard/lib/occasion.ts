import type {
  CreateOccasionInput,
  UpdateOccasionInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import type {
  OccasionsListResponse,
  OccasionSingleResponse,
  OccasionDeleteResponse,
  OccasionReorderResponse,
} from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/occasion.type";

export const occasionClient = {
  getAllOccasions: async (): Promise<OccasionsListResponse> => {
    try {
      const res = await apiClient.get<OccasionsListResponse>("/occasions");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getOccasionById: async (id: number): Promise<OccasionSingleResponse> => {
    try {
      const res = await apiClient.get<OccasionSingleResponse>(
        `/occasions/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createOccasion: async (
    payload: CreateOccasionInput | FormData,
  ): Promise<OccasionSingleResponse> => {
    try {
      const res = await apiClient.post<OccasionSingleResponse>(
        "/occasions",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateOccasion: async (
    id: number,
    payload: UpdateOccasionInput | FormData,
  ): Promise<OccasionSingleResponse> => {
    try {
      const res = await apiClient.put<OccasionSingleResponse>(
        `/occasions/${id}`,
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  deleteOccasion: async (id: number): Promise<OccasionDeleteResponse> => {
    try {
      const res = await apiClient.delete<OccasionDeleteResponse>(
        `/occasions/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  reorderOccasion: async (
    id: number,
    displayOrder: number,
  ): Promise<OccasionReorderResponse> => {
    try {
      const res = await apiClient.put<OccasionReorderResponse>(
        `/occasions/${id}/reorder`,
        { displayOrder },
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  batchReorderOccasions: async (
    payload: BatchReorderInput,
  ): Promise<OccasionReorderResponse> => {
    try {
      const res = await apiClient.put<OccasionReorderResponse>(
        "/occasions/reorder",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};

export default occasionClient;
