import { contactClient } from "@/lib";
import type {
  CreateContactSettingsInput,
  UpdateContactSettingsInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const contactKeys = {
  all: ["contact"] as const,
  detail: (id?: number) => [...contactKeys.all, id ?? "active"] as const,
};

export function useContact(id?: number) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactClient.getContact(id),
    refetchOnReconnect: true,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactSettingsInput) =>
      contactClient.createContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useUpdateContact(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContactSettingsInput) =>
      contactClient.updateContact(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}
