import type { Request, Response } from "express";
import {
  createHomepageSchema,
  updateHomepageSchema,
} from "@repo/zod-validations";
import { HomepageService } from "@/services/homepage.service";
import { formatZodErrors } from "@/utils/zodErrors";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class HomepageController {
  static async createHomepage(req: Request, res: Response) {
    const files = req.files as
      | {
        heroImage?: Express.Multer.File[];
        aboutImage?: Express.Multer.File[];
      }
      | undefined;

    const heroImageUrl = files?.heroImage?.[0]
      ? await uploadToCloudinary(files.heroImage[0].buffer)
      : null;

    const aboutImageUrl = files?.aboutImage?.[0]
      ? await uploadToCloudinary(files.aboutImage[0].buffer)
      : null;

    const parsedData = createHomepageSchema.safeParse({
      ...req.body,
      ...(heroImageUrl && { heroImage: heroImageUrl }),
      ...(aboutImageUrl && { aboutImage: aboutImageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const homepage = await HomepageService.createHomepage(parsedData.data);

    return res.status(201).json({
      message: "Homepage content saved successfully",
      homepage,
    });
  }

  static async getHomepage(req: Request, res: Response) {
    const id = req.params?.id ? Number(req.params.id) : undefined;

    if (req.params?.id && (isNaN(id!) || id! <= 0)) {
      return res.status(422).json({
        errors: { id: ["Homepage ID must be a positive integer."] },
      });
    }

    const homepage = await HomepageService.getHomepage(id);

    return res.status(200).json({
      message: "Homepage content fetched successfully",
      homepage,
    });
  }

  static async updateHomepage(req: Request, res: Response) {
    const rawId = req.params?.id ?? req.body?.id;
    const id = rawId !== undefined ? Number(rawId) : undefined;

    if (id !== undefined && (isNaN(id) || id <= 0)) {
      return res.status(422).json({
        errors: { id: ["Homepage ID must be a positive integer."] },
      });
    }

    const files = req.files as
      | {
        heroImage?: Express.Multer.File[];
        aboutImage?: Express.Multer.File[];
      }
      | undefined;

    const heroImageUrl = files?.heroImage?.[0]
      ? await uploadToCloudinary(files.heroImage[0].buffer)
      : null;

    const aboutImageUrl = files?.aboutImage?.[0]
      ? await uploadToCloudinary(files.aboutImage[0].buffer)
      : null;

    const parsedData = updateHomepageSchema.safeParse({
      ...req.body,
      ...(heroImageUrl && { heroImage: heroImageUrl }),
      ...(aboutImageUrl && { aboutImage: aboutImageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const homepage = await HomepageService.updateHomepage(id, parsedData.data);

    return res.status(200).json({
      message: "Homepage content updated successfully",
      homepage,
    });
  }
}
