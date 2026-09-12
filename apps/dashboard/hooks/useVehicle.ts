import { vehicleClient } from "@/lib";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  detail: (id: number) => [...vehicleKeys.all, id] as const,
};

export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.all,
    queryFn: () => vehicleClient.getAllVehicles(),
    refetchOnReconnect: true,
  });
}

export function useVehicle(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleClient.getVehicleById(id),
    enabled: options?.enabled ?? id > 0,
    refetchOnReconnect: true,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehicleInput | FormData) =>
      vehicleClient.createVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateVehicleInput | FormData;
    }) => vehicleClient.updateVehicle(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehicleClient.deleteVehicle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(id) });
    },
  });
}

export function useReorderVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) =>
      vehicleClient.reorderVehicle(id, displayOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

export function useBatchReorderVehicles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchReorderInput) =>
      vehicleClient.batchReorderVehicles(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}
