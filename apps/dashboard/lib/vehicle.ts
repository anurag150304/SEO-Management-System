import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  BatchReorderInput,
} from "@repo/zod-validations";
import type {
  VehiclesListResponse,
  VehicleSingleResponse,
  VehicleDeleteResponse,
  VehicleReorderResponse,
} from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/vehicle.type";

export const vehicleClient = {
  getAllVehicles: async (): Promise<VehiclesListResponse> => {
    try {
      const res = await apiClient.get<VehiclesListResponse>("/vehicles");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  getVehicleById: async (id: number): Promise<VehicleSingleResponse> => {
    try {
      const res = await apiClient.get<VehicleSingleResponse>(`/vehicles/${id}`);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createVehicle: async (
    payload: CreateVehicleInput | FormData,
  ): Promise<VehicleSingleResponse> => {
    try {
      const res = await apiClient.post<VehicleSingleResponse>(
        "/vehicles",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateVehicle: async (
    id: number,
    payload: UpdateVehicleInput | FormData,
  ): Promise<VehicleSingleResponse> => {
    try {
      const res = await apiClient.put<VehicleSingleResponse>(
        `/vehicles/${id}`,
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  deleteVehicle: async (id: number): Promise<VehicleDeleteResponse> => {
    try {
      const res = await apiClient.delete<VehicleDeleteResponse>(
        `/vehicles/${id}`,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  reorderVehicle: async (
    id: number,
    displayOrder: number,
  ): Promise<VehicleReorderResponse> => {
    try {
      const res = await apiClient.put<VehicleReorderResponse>(
        `/vehicles/${id}/reorder`,
        { displayOrder },
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  batchReorderVehicles: async (
    payload: BatchReorderInput,
  ): Promise<VehicleReorderResponse> => {
    try {
      const res = await apiClient.put<VehicleReorderResponse>(
        "/vehicles/reorder",
        payload,
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
