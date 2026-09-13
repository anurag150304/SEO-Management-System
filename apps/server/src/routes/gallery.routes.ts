import { Router } from "express";
import { GalleryController } from "@/controllers/gallery.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.put("/reorder", authUser, GalleryController.reorderGallery);
router.put("/:id/reorder", authUser, GalleryController.reorderGallery);

router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  GalleryController.createGalleryItem,
);

router.get("/", authUser, GalleryController.getAllGalleryItems);

router.get("/:id", authUser, GalleryController.getGalleryItemById);

router.put(
  "/:id",
  authUser,
  upload.single("image"),
  GalleryController.updateGalleryItem,
);
router.post(
  "/update/:id",
  authUser,
  upload.single("image"),
  GalleryController.updateGalleryItem,
);

router.delete("/:id", authUser, GalleryController.deleteGalleryItem);

export default router;
