import type { Request, Response } from "express";
import {
  createGallerySchema,
  updateGallerySchema,
} from "@repo/zod-validations";
import {
  idParamValidation,
  singleReorderSchema,
  batchReorderSchema,
} from "@repo/zod-validations";
import { GalleryService } from "@/services/gallery.service";
import { formatZodErrors } from "@/utils/zodErrors";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class GalleryController {
  static async createGalleryItem(req: Request, res: Response) {
    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;
    const effectiveImage = imageUrl || req.body?.image;

    if (!effectiveImage) {
      return res.status(422).json({
        errors: { image: ["Image file or valid image URL is required."] },
      });
    }

    const parsedData = createGallerySchema.safeParse({
      ...req.body,
      image: effectiveImage,
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const item = await GalleryService.createGalleryItem({
      ...parsedData.data,
      image: effectiveImage,
    });

    return res.status(201).json({
      message: "Gallery image uploaded successfully",
      galleryItem: item,
    });
  }

  static async getAllGalleryItems(_req: Request, res: Response) {
    const gallery = await GalleryService.getAllGalleryItems();

    return res.status(200).json({
      message: "Gallery images fetched successfully",
      count: gallery.length,
      gallery,
    });
  }

  static async getGalleryItemById(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const galleryItem = await GalleryService.getGalleryItemById(
      parsedId.data.id,
    );

    return res.status(200).json({
      message: "Gallery image fetched successfully",
      galleryItem,
    });
  }

  static async updateGalleryItem(req: Request, res: Response) {
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

    const parsedData = updateGallerySchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const galleryItem = await GalleryService.updateGalleryItem(
      parsedId.data.id,
      parsedData.data,
    );

    return res.status(200).json({
      message: "Gallery image updated successfully",
      galleryItem,
    });
  }

  static async deleteGalleryItem(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const deleted = await GalleryService.deleteGalleryItem(parsedId.data.id);

    return res.status(200).json({
      message: "Gallery image deleted successfully",
      galleryId: deleted.id,
    });
  }

  static async reorderGallery(req: Request, res: Response) {
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

      const galleryItem = await GalleryService.reorderGalleryItem(
        parsedId.data.id,
        parsedItem.data.displayOrder,
      );

      return res.status(200).json({
        message: "Gallery display order updated successfully",
        galleryItem,
      });
    }

    const parsedData = batchReorderSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const gallery = await GalleryService.batchReorderGallery(parsedData.data);

    return res.status(200).json({
      message: "Gallery images reordered successfully",
      gallery,
    });
  }
}
