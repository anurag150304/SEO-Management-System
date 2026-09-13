import type { Request, Response } from "express";
import { SEOService } from "@/services/seo.service";
import { SchemaService } from "@/services/schema.service";
import { HomepageService } from "@/services/homepage.service";
import { VehicleService } from "@/services/vehicle.service";
import { OccasionService } from "@/services/occasion.service";
import { TestimonialService } from "@/services/testimonial.service";
import { GalleryService } from "@/services/gallery.service";
import { ContactService } from "@/services/contact.service";

// Async wrap used to get resolve or reject promise without crashng server
async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export class PublicController {
  static async getPublicHomepageData(_req: Request, res: Response) {
    const [
      seo,
      rawSchemas,
      homepage,
      vehicles,
      occasions,
      testimonials,
      gallery,
      contact,
    ] = await Promise.all([
      safeFetch(() => SEOService.getSEOData()),
      safeFetch(() => SchemaService.getAllSchemas()),
      safeFetch(() => HomepageService.getHomepage()),
      safeFetch(() => VehicleService.getAllVehicles()),
      safeFetch(() => OccasionService.getAllOccasions()),
      safeFetch(() => TestimonialService.getAllTestimonials()),
      safeFetch(() => GalleryService.getAllGalleryItems()),
      safeFetch(() => ContactService.getContactSettings()),
    ]);

    const schemas = rawSchemas || [];

    // Pre-format all active schemas into standard JSON-LD structures for head injection
    const jsonLd = schemas.map((schema) =>
      SchemaService.formatToJsonLd(schema),
    );

    return res.status(200).json({
      message: "Public homepage data fetched successfully",
      data: {
        seo: seo || null,
        schemas,
        jsonLd,
        homepage: homepage || null,
        vehicles: vehicles || [],
        occasions: occasions || [],
        testimonials: testimonials || [],
        gallery: gallery || [],
        contact: contact || null,
      },
    });
  }

  static async getPublicSeoData(_req: Request, res: Response) {
    const [seo, rawSchemas] = await Promise.all([
      safeFetch(() => SEOService.getSEOData()),
      safeFetch(() => SchemaService.getAllSchemas()),
    ]);

    const schemas = rawSchemas || [];
    const jsonLd = schemas.map((schema) =>
      SchemaService.formatToJsonLd(schema),
    );

    return res.status(200).json({
      message: "Public SEO metadata fetched successfully",
      seo: seo || null,
      schemas,
      jsonLd,
    });
  }
}
