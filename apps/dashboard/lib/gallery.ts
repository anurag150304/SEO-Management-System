import type {
  CreateGalleryInput,
  UpdateGalleryInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import { apiClient, handleAxiosError } from "./api/client";
import type {
  GalleryDeleteResponse,
  GalleryListResponse,
  GalleryReorderResponse,
  GallerySingleResponse,
} from "@/types/gallery.type";

export const galleryClient = {
  getAllGallery: async (): Promise<GalleryListResponse> => {
    try {
      const res = await apiClient.get<GalleryListResponse>("/gallery");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getGalleryById: async (id: number): Promise<GallerySingleResponse> => {
    try {
      const res = await apiClient.get<GallerySingleResponse>(`/gallery/${id}`);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getGalleryItemById: async (id: number): Promise<GallerySingleResponse> => {
    try {
      const res = await apiClient.get<GallerySingleResponse>(`/gallery/${id}`);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createGalleryItem: async (
    payload: CreateGalleryInput | FormData,
  ): Promise<GallerySingleResponse> => {
    try {
      const res = await apiClient.post<GallerySingleResponse>(
        "/gallery",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateGalleryItem: async (
    id: number,
    payload: UpdateGalleryInput | FormData,
  ): Promise<GallerySingleResponse> => {
    try {
      const res = await apiClient.put<GallerySingleResponse>(
        `/gallery/${id}`,
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  deleteGalleryItem: async (id: number): Promise<GalleryDeleteResponse> => {
    try {
      const res = await apiClient.delete<GalleryDeleteResponse>(
        `/gallery/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  reorderGalleryItem: async (
    id: number,
    displayOrder: number,
  ): Promise<GalleryReorderResponse> => {
    try {
      const res = await apiClient.put<GalleryReorderResponse>(
        `/gallery/${id}/reorder`,
        { displayOrder },
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  batchReorderGallery: async (
    payload: BatchReorderInput,
  ): Promise<GalleryReorderResponse> => {
    try {
      const res = await apiClient.put<GalleryReorderResponse>(
        "/gallery/reorder",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
