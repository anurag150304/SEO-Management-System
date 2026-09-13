import { Router } from "express";
import { PublicController } from "@/controllers/public.controller";
import { VehicleController } from "@/controllers/vehicle.controller";
import { OccasionController } from "@/controllers/occasion.controller";
import { TestimonialController } from "@/controllers/testimonial.controller";
import { GalleryController } from "@/controllers/gallery.controller";
import { ContactController } from "@/controllers/contact.controller";
import { SchemaController } from "@/controllers/schema.controller";

const router: Router = Router();

router.get("/homepage", PublicController.getPublicHomepageData);
router.get("/seo", PublicController.getPublicSeoData);

router.get("/vehicles", VehicleController.getAllVehicles);
router.get("/occasions", OccasionController.getAllOccasions);
router.get("/testimonials", TestimonialController.getAllTestimonials);
router.get("/gallery", GalleryController.getAllGalleryItems);
router.get("/contact", ContactController.getContactSettings);
router.get("/schemas", SchemaController.getAllSchemas);

export default router;
