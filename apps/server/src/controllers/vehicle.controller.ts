import type { Request, Response } from "express";
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdParamValidation,
  reorderVehiclesSchema,
  reorderVehicleItemSchema,
} from "@repo/zod-validations";
import { VehicleService } from "@/services/vehicle.service";
import { formatZodErrors } from "@/utils/zodErrors";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class VehicleController {
  static async createVehicle(req: Request, res: Response) {
    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;

    const parsedData = createVehicleSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const vehicle = await VehicleService.createVehicle(parsedData.data);

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  }

  static async getAllVehicles(_req: Request, res: Response) {
    const vehicles = await VehicleService.getAllVehicles();

    return res.status(200).json({
      message: "Vehicles fetched successfully",
      count: vehicles.length,
      vehicles,
    });
  }

  static async getVehicleById(req: Request, res: Response) {
    const parsedId = vehicleIdParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const vehicle = await VehicleService.getVehicleById(parsedId.data.id);

    return res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle,
    });
  }

  static async updateVehicle(req: Request, res: Response) {
    const parsedId = vehicleIdParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;

    const parsedData = updateVehicleSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const vehicle = await VehicleService.updateVehicle(
      parsedId.data.id,
      parsedData.data,
    );

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  }

  static async deleteVehicle(req: Request, res: Response) {
    const parsedId = vehicleIdParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const deleted = await VehicleService.deleteVehicle(parsedId.data.id);

    return res.status(200).json({
      message: "Vehicle deleted successfully",
      vehicleId: deleted.id,
    });
  }

  static async reorderVehicles(req: Request, res: Response) {
    const rawId = req.params?.id ?? req.body?.id;
    const requestedOrder = req.body?.displayOrder;

    if (rawId !== undefined && requestedOrder !== undefined) {
      const parsedId = vehicleIdParamValidation.safeParse({ id: rawId });
      if (!parsedId.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedId.error),
        });
      }

      const parsedItem = reorderVehicleItemSchema.safeParse({
        id: parsedId.data.id,
        displayOrder: requestedOrder,
      });

      if (!parsedItem.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedItem.error),
        });
      }

      const vehicle = await VehicleService.reorderVehicle(
        parsedId.data.id,
        parsedItem.data.displayOrder,
      );

      return res.status(200).json({
        message: "Vehicle display order updated successfully",
        vehicle,
      });
    }

    const parsedData = reorderVehiclesSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const vehicles = await VehicleService.reorderVehicles(parsedData.data);

    return res.status(200).json({
      message: "Vehicles reordered successfully",
      vehicles,
    });
  }
}
