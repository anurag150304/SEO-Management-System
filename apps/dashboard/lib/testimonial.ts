import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import type {
  TestimonialsListResponse,
  TestimonialSingleResponse,
  TestimonialDeleteResponse,
  TestimonialReorderResponse,
} from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/testimonials.type";

export const testimonialClient = {
  getAllTestimonials: async (): Promise<TestimonialsListResponse> => {
    try {
      const res =
        await apiClient.get<TestimonialsListResponse>("/testimonials");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getTestimonialById: async (
    id: number,
  ): Promise<TestimonialSingleResponse> => {
    try {
      const res = await apiClient.get<TestimonialSingleResponse>(
        `/testimonials/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createTestimonial: async (
    payload: CreateTestimonialInput | FormData,
  ): Promise<TestimonialSingleResponse> => {
    try {
      const res = await apiClient.post<TestimonialSingleResponse>(
        "/testimonials",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateTestimonial: async (
    id: number,
    payload: UpdateTestimonialInput | FormData,
  ): Promise<TestimonialSingleResponse> => {
    try {
      const res = await apiClient.put<TestimonialSingleResponse>(
        `/testimonials/${id}`,
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  deleteTestimonial: async (id: number): Promise<TestimonialDeleteResponse> => {
    try {
      const res = await apiClient.delete<TestimonialDeleteResponse>(
        `/testimonials/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  reorderTestimonial: async (
    id: number,
    displayOrder: number,
  ): Promise<TestimonialReorderResponse> => {
    try {
      const res = await apiClient.put<TestimonialReorderResponse>(
        `/testimonials/${id}/reorder`,
        { displayOrder },
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  batchReorderTestimonials: async (
    payload: BatchReorderInput,
  ): Promise<TestimonialReorderResponse> => {
    try {
      const res = await apiClient.put<TestimonialReorderResponse>(
        "/testimonials/reorder",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
