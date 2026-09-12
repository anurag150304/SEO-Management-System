import type { VehicleRecord } from "@repo/db-config";

export interface VehiclesListResponse {
  message: string;
  count: number;
  vehicles: VehicleRecord[];
}

export interface VehicleSingleResponse {
  message: string;
  vehicle: VehicleRecord;
}

export interface VehicleDeleteResponse {
  message: string;
  vehicleId: number;
}

export interface VehicleReorderResponse {
  message: string;
  vehicle?: VehicleRecord;
  vehicles?: VehicleRecord[];
}
