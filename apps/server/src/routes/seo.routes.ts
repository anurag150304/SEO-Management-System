import { Router } from "express";
import { SEOController } from "@/controllers/seo.controller";
import { authUser } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";

const router: Router = Router();

const seoUploads = upload.fields([
  { name: "ogImage", maxCount: 1 },
  { name: "twitterImage", maxCount: 1 },
]);

// Read active or specific SEO metadata
router.get(["/", "/:id"], SEOController.getSEO);

// Create SEO metadata (or update if already exists)
router.post(["/", "/create"], authUser, seoUploads, SEOController.createSEO);

// Update SEO metadata
router.put(
  ["/", "/:id", "/update"],
  authUser,
  seoUploads,
  SEOController.updateSEO,
);
router.post(["/update", "/:id"], authUser, seoUploads, SEOController.updateSEO);

export default router;
