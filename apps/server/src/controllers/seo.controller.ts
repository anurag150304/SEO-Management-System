import type { Request, Response } from "express";
import { createSeoSchema, updateSeoSchema } from "@repo/zod-validations";
import { formatZodErrors } from "@/utils/zodErrors";
import { SEOService } from "@/services/seo.service";
import { CTError } from "@/utils/errHandler.util";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class SEOController {
  static async getSEO(req: Request, res: Response) {
    const rawId = req.params?.id;
    const id = rawId ? Number(rawId) : undefined;

    if (rawId && (isNaN(id!) || id! <= 0)) {
      return res.status(422).json({
        errors: { id: ["SEO ID must be a positive integer."] },
      });
    }

    const seo = await SEOService.getSEOData(id);

    return res.status(200).json({
      message: "SEO metadata fetched successfully",
      seo,
    });
  }

  static async addSEO(req: Request, res: Response) {
    const files = req.files as
      | {
        ogImage?: Express.Multer.File[];
        twitterImage?: Express.Multer.File[];
      }
      | undefined;

    const ogImageUrl = files?.ogImage?.[0]
      ? await uploadToCloudinary(files.ogImage[0].buffer)
      : null;

    const twitterImageUrl = files?.twitterImage?.[0]
      ? await uploadToCloudinary(files.twitterImage[0].buffer)
      : null;

    const parsedData = createSeoSchema.safeParse({
      ...req.body,
      ...(ogImageUrl && { ogImage: ogImageUrl }),
      ...(twitterImageUrl && { twitterImage: twitterImageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const inserted = await SEOService.insertSEOData(parsedData.data);
    if (!inserted) {
      throw new CTError(400, "Something went wrong while adding SEO data!");
    }

    return res.status(200).json({
      message: "SEO data saved successfully",
      seo: inserted,
    });
  }

  static async updateSEO(req: Request, res: Response) {
    const rawId = req.params?.id ?? req.body?.seoId;
    const seoId = rawId ? Number(rawId) : undefined;

    const files = req.files as
      | {
        ogImage?: Express.Multer.File[];
        twitterImage?: Express.Multer.File[];
      }
      | undefined;

    const ogImageUrl = files?.ogImage?.[0]
      ? await uploadToCloudinary(files.ogImage[0].buffer)
      : null;

    const twitterImageUrl = files?.twitterImage?.[0]
      ? await uploadToCloudinary(files.twitterImage[0].buffer)
      : null;

    const parsedData = updateSeoSchema.safeParse({
      ...req.body,
      ...(seoId !== undefined && { seoId }),
      ...(ogImageUrl && { ogImage: ogImageUrl }),
      ...(twitterImageUrl && { twitterImage: twitterImageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const data = await SEOService.updateSEOData(parsedData.data);
    if (!data) {
      throw new CTError(
        400,
        "Something went wrong while updating SEO metadata!"
      );
    }

    return res.status(200).json({
      message: "Metadata updated successfully",
      seo: data,
    });
  }
}
