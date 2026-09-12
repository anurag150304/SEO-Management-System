import { seoClient } from "@/lib";
import type {
  createSeoSchemaType,
  updateSeoSchemaType,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const seoKeys = {
  all: ["seo_metadata"] as const,
  detail: (id?: number) => [...seoKeys.all, id ?? "active"] as const,
};

export function useSeo(id?: number) {
  return useQuery({
    queryKey: seoKeys.detail(id),
    queryFn: () => seoClient.getSeo(id),
    refetchOnReconnect: true,
  });
}

export function useCreateSeo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: createSeoSchemaType | FormData) =>
      seoClient.createSeo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seoKeys.all });
    },
  });
}

export function useUpdateSeo(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: updateSeoSchemaType | FormData) =>
      seoClient.updateSeo(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seoKeys.all });
    },
  });
}
