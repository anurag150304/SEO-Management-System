import { homepageClient } from "@/lib";
import type {
  CreateHomepageInput,
  UpdateHomepageInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const homepageKeys = {
  all: ["homepage"] as const,
  detail: (id?: number) => [...homepageKeys.all, id ?? "active"] as const,
};

export function useHomepage(id?: number) {
  return useQuery({
    queryKey: homepageKeys.detail(id),
    queryFn: () => homepageClient.getHomepage(id),
    refetchOnReconnect: true,
  });
}

export function useCreateHomepage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHomepageInput | FormData) =>
      homepageClient.createHomepage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}

export function useUpdateHomepage(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateHomepageInput | FormData) =>
      homepageClient.updateHomepage(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}
