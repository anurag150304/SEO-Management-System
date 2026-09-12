import { testimonialClient } from "@/lib";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const testimonialKeys = {
  all: ["testimonials"] as const,
  detail: (id: number) => [...testimonialKeys.all, id] as const,
};

export function useTestimonials() {
  return useQuery({
    queryKey: testimonialKeys.all,
    queryFn: () => testimonialClient.getAllTestimonials(),
    refetchOnReconnect: true,
  });
}

export function useTestimonial(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: testimonialKeys.detail(id),
    queryFn: () => testimonialClient.getTestimonialById(id),
    enabled: options?.enabled ?? id > 0,
    refetchOnReconnect: true,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTestimonialInput | FormData) =>
      testimonialClient.createTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTestimonialInput | FormData;
    }) => testimonialClient.updateTestimonial(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => testimonialClient.deleteTestimonial(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.removeQueries({ queryKey: testimonialKeys.detail(id) });
    },
  });
}

export function useReorderTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) =>
      testimonialClient.reorderTestimonial(id, displayOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}

export function useBatchReorderTestimonials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchReorderInput) =>
      testimonialClient.batchReorderTestimonials(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}
