import { Router } from "express";
import { GalleryController } from "@/controllers/gallery.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Reorder gallery items (must precede /:id)
router.put("/reorder", authUser, GalleryController.reorderGallery);
router.put("/:id/reorder", authUser, GalleryController.reorderGallery);

// Create gallery item
router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  GalleryController.createGalleryItem,
);

// Read all gallery items
router.get("/", authUser, GalleryController.getAllGalleryItems);

// Read single gallery item by id
router.get("/:id", authUser, GalleryController.getGalleryItemById);

// Update gallery item by id
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

// Delete gallery item by id
router.delete("/:id", authUser, GalleryController.deleteGalleryItem);

export default router;
