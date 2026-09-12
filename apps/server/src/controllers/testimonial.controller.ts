import type { Request, Response } from "express";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "@repo/zod-validations";
import {
  idParamValidation,
  singleReorderSchema,
  batchReorderSchema,
} from "@repo/zod-validations";
import { TestimonialService } from "@/services/testimonial.service";
import { formatZodErrors } from "@/utils/zodErrors";
import { uploadToCloudinary } from "@/lib/uploadFiles.lib";

export class TestimonialController {
  static async createTestimonial(req: Request, res: Response) {
    const file = req.file;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageBuffer = file?.buffer || files?.image?.[0]?.buffer;

    const imageUrl = imageBuffer ? await uploadToCloudinary(imageBuffer) : null;

    const parsedData = createTestimonialSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const testimonial = await TestimonialService.createTestimonial(
      parsedData.data,
    );

    return res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  }

  static async getAllTestimonials(_req: Request, res: Response) {
    const testimonials = await TestimonialService.getAllTestimonials();

    return res.status(200).json({
      message: "Testimonials fetched successfully",
      count: testimonials.length,
      testimonials,
    });
  }

  static async getTestimonialById(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const testimonial = await TestimonialService.getTestimonialById(
      parsedId.data.id,
    );

    return res.status(200).json({
      message: "Testimonial fetched successfully",
      testimonial,
    });
  }

  static async updateTestimonial(req: Request, res: Response) {
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

    const parsedData = updateTestimonialSchema.safeParse({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const testimonial = await TestimonialService.updateTestimonial(
      parsedId.data.id,
      parsedData.data,
    );

    return res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  }

  static async deleteTestimonial(req: Request, res: Response) {
    const parsedId = idParamValidation.safeParse(req.params);

    if (!parsedId.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedId.error),
      });
    }

    const deleted = await TestimonialService.deleteTestimonial(
      parsedId.data.id,
    );

    return res.status(200).json({
      message: "Testimonial deleted successfully",
      testimonialId: deleted.id,
    });
  }

  static async reorderTestimonials(req: Request, res: Response) {
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

      const testimonial = await TestimonialService.reorderTestimonial(
        parsedId.data.id,
        parsedItem.data.displayOrder,
      );

      return res.status(200).json({
        message: "Testimonial display order updated successfully",
        testimonial,
      });
    }

    const parsedData = batchReorderSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const testimonials = await TestimonialService.batchReorderTestimonials(
      parsedData.data,
    );

    return res.status(200).json({
      message: "Testimonials reordered successfully",
      testimonials,
    });
  }
}
