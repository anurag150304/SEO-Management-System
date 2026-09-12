import type { Request, Response } from "express";
import {
  createContactSettingsSchema,
  updateContactSettingsSchema,
} from "@repo/zod-validations";
import { ContactService } from "@/services/contact.service";
import { formatZodErrors } from "@/utils/zodErrors";

export class ContactController {
  static async createContactSettings(req: Request, res: Response) {
    const parsedData = createContactSettingsSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const contactSettings = await ContactService.createContactSettings(
      parsedData.data,
    );

    return res.status(201).json({
      message: "Contact settings saved successfully",
      contactSettings,
    });
  }

  static async getContactSettings(req: Request, res: Response) {
    const id = req.params?.id ? Number(req.params.id) : undefined;

    if (req.params?.id && (isNaN(id!) || id! <= 0)) {
      return res.status(422).json({
        errors: { id: ["ID must be a positive integer."] },
      });
    }

    const contactSettings = await ContactService.getContactSettings(id);

    return res.status(200).json({
      message: "Contact settings fetched successfully",
      contactSettings,
    });
  }

  static async updateContactSettings(req: Request, res: Response) {
    const rawId = req.params?.id ?? req.body?.id;
    const id = rawId !== undefined ? Number(rawId) : undefined;

    if (id !== undefined && (isNaN(id) || id <= 0)) {
      return res.status(422).json({
        errors: { id: ["ID must be a positive integer."] },
      });
    }

    const parsedData = updateContactSettingsSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const contactSettings = await ContactService.updateContactSettings(
      id,
      parsedData.data,
    );

    return res.status(200).json({
      message: "Contact settings updated successfully",
      contactSettings,
    });
  }
}
