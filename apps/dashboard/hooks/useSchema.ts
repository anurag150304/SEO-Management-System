import { schemaClient } from "@/lib";
import type {
  CreateSchemaInput,
  SupportedSchemaType,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const schemaKeys = {
  all: ["schemas"] as const,
  detail: (type: string) => [...schemaKeys.all, type] as const,
};

export function useSchemas() {
  return useQuery({
    queryKey: schemaKeys.all,
    queryFn: () => schemaClient.getAllSchemas(),
    refetchOnReconnect: true,
  });
}

export function useSchemaByType(
  schemaType: SupportedSchemaType | string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: schemaKeys.detail(schemaType),
    queryFn: () => schemaClient.getSchemaByType(schemaType),
    enabled: options?.enabled ?? Boolean(schemaType),
    refetchOnReconnect: true,
  });
}

export function useCreateSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchemaInput) =>
      schemaClient.createSchema(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: schemaKeys.all });
      if (data.schema?.schemaType) {
        queryClient.invalidateQueries({
          queryKey: schemaKeys.detail(data.schema.schemaType),
        });
      }
    },
  });
}

export function useUpdateSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schemaType,
      schemaData,
    }: {
      schemaType: SupportedSchemaType | string;
      schemaData: unknown;
    }) => schemaClient.updateSchema(schemaType, schemaData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: schemaKeys.all });
      queryClient.invalidateQueries({
        queryKey: schemaKeys.detail(variables.schemaType),
      });
    },
  });
}

export function useDeleteSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schemaType: SupportedSchemaType | string) =>
      schemaClient.deleteSchema(schemaType),
    onSuccess: (_, schemaType) => {
      queryClient.invalidateQueries({ queryKey: schemaKeys.all });
      queryClient.removeQueries({ queryKey: schemaKeys.detail(schemaType) });
    },
  });
}
