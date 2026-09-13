import { Router } from "express";
import { SEOController } from "@/controllers/seo.controller";
import { authUser } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";

const router: Router = Router();

const seoUploads = upload.fields([
  { name: "ogImage", maxCount: 1 },
  { name: "twitterImage", maxCount: 1 },
]);

router.get(["/", "/:id"], SEOController.getSEO);
router.post(["/", "/create"], authUser, seoUploads, SEOController.createSEO);
router.post(["/update", "/:id"], authUser, seoUploads, SEOController.updateSEO);

router.put(
  ["/", "/:id", "/update"],
  authUser,
  seoUploads,
  SEOController.updateSEO,
);

export default router;
