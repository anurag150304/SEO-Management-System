import { occasionClient } from "@/lib";
import type {
  CreateOccasionInput,
  UpdateOccasionInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const occasionKeys = {
  all: ["occasions"] as const,
  detail: (id: number) => [...occasionKeys.all, id] as const,
};

export function useOccasions() {
  return useQuery({
    queryKey: occasionKeys.all,
    queryFn: () => occasionClient.getAllOccasions(),
    refetchOnReconnect: true,
  });
}

export function useOccasion(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: occasionKeys.detail(id),
    queryFn: () => occasionClient.getOccasionById(id),
    enabled: options?.enabled ?? id > 0,
    refetchOnReconnect: true,
  });
}

export function useCreateOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOccasionInput | FormData) =>
      occasionClient.createOccasion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occasionKeys.all });
    },
  });
}

export function useUpdateOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateOccasionInput | FormData;
    }) => occasionClient.updateOccasion(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: occasionKeys.all });
      queryClient.invalidateQueries({
        queryKey: occasionKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => occasionClient.deleteOccasion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: occasionKeys.all });
      queryClient.removeQueries({ queryKey: occasionKeys.detail(id) });
    },
  });
}

export function useReorderOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) =>
      occasionClient.reorderOccasion(id, displayOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occasionKeys.all });
    },
  });
}

export function useBatchReorderOccasions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchReorderInput) =>
      occasionClient.batchReorderOccasions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occasionKeys.all });
    },
  });
}
