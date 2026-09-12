import type { Request, Response } from "express";
import {
  createOccasionSchema,
  updateOccasionSchema,
} from "@repo/zod-validations";
import {
  idParamValidation,
  singleReorderSchema,
  batchReorderSchema,
} from "@repo/zod-validations";
import { OccasionService } from "@/services/occasion.service";
import { formatZodErrors } from "@/utils/zodErrors";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class OccasionController {
  static async createOccasion(req: Request, res: Response) {
    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;

    const parsedData = createOccasionSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const occasion = await OccasionService.createOccasion(parsedData.data);

    return res.status(201).json({
      message: "Occasion created successfully",
      occasion,
    });
  }

  static async getAllOccasions(_req: Request, res: Response) {
    const occasions = await OccasionService.getAllOccasions();

    return res.status(200).json({
      message: "Occasions fetched successfully",
      count: occasions.length,
      occasions,
    });
  }

  static async getOccasionById(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const occasion = await OccasionService.getOccasionById(parsedId.data.id);

    return res.status(200).json({
      message: "Occasion fetched successfully",
      occasion,
    });
  }

  static async updateOccasion(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;

    const parsedData = updateOccasionSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const occasion = await OccasionService.updateOccasion(
      parsedId.data.id,
      parsedData.data,
    );

    return res.status(200).json({
      message: "Occasion updated successfully",
      occasion,
    });
  }

  static async deleteOccasion(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const deleted = await OccasionService.deleteOccasion(parsedId.data.id);

    return res.status(200).json({
      message: "Occasion deleted successfully",
      occasionId: deleted.id,
    });
  }

  static async reorderOccasions(req: Request, res: Response) {
    const rawId = req.params?.id ?? req.body?.id;
    const requestedOrder = req.body?.displayOrder;

    if (rawId !== undefined && requestedOrder !== undefined) {
      const parsedId = idParamValidation.safeParse({ id: rawId });
      if (!parsedId.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedId.error),
        });
      }

      const parsedItem = singleReorderSchema.safeParse({
        id: parsedId.data.id,
        displayOrder: requestedOrder,
      });

      if (!parsedItem.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedItem.error),
        });
      }

      const occasion = await OccasionService.reorderOccasion(
        parsedId.data.id,
        parsedItem.data.displayOrder,
      );

      return res.status(200).json({
        message: "Occasion display order updated successfully",
        occasion,
      });
    }

    const parsedData = batchReorderSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const occasions = await OccasionService.batchReorderOccasions(
      parsedData.data,
    );

    return res.status(200).json({
      message: "Occasions reordered successfully",
      occasions,
    });
  }
}
