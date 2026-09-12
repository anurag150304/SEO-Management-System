import type { GalleryRecord } from "@repo/db-config";

export interface GalleryListResponse {
  message: string;
  count: number;
  gallery: GalleryRecord[];
}

export interface GallerySingleResponse {
  message: string;
  galleryItem: GalleryRecord;
}

export interface GalleryDeleteResponse {
  message: string;
  galleryId: number;
}

export interface GalleryReorderResponse {
  message: string;
  galleryItem?: GalleryRecord;
  gallery?: GalleryRecord[];
}
