import { galleryClient } from "@/lib";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const galleryKeys = {
  all: ["gallery"] as const,
  detail: (id: number) => [...galleryKeys.all, id] as const,
};

export function useGallery() {
  return useQuery({
    queryKey: galleryKeys.all,
    queryFn: () => galleryClient.getAllGallery(),
    refetchOnReconnect: true,
  });
}

export function useGalleryItem(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => galleryClient.getGalleryItemById(id),
    enabled: options?.enabled ?? id > 0,
    refetchOnReconnect: true,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGalleryInput | FormData) =>
      galleryClient.createGalleryItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateGalleryInput | FormData;
    }) => galleryClient.updateGalleryItem(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({
        queryKey: galleryKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => galleryClient.deleteGalleryItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.removeQueries({ queryKey: galleryKeys.detail(id) });
    },
  });
}

export function useReorderGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) =>
      galleryClient.reorderGalleryItem(id, displayOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export function useBatchReorderGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchReorderInput) =>
      galleryClient.batchReorderGallery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}
