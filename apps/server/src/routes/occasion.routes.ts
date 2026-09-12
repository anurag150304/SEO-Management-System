import { Router } from "express";
import { OccasionController } from "@/controllers/occasion.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Reorder occasions (must precede /:id)
router.put("/reorder", authUser, OccasionController.reorderOccasions);
router.put("/:id/reorder", authUser, OccasionController.reorderOccasions);

// Create occasion
router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  OccasionController.createOccasion,
);

// Read all occasions
router.get("/", authUser, OccasionController.getAllOccasions);

// Read single occasion by id
router.get("/:id", authUser, OccasionController.getOccasionById);

// Update occasion by id
router.put(
  "/:id",
  authUser,
  upload.single("image"),
  OccasionController.updateOccasion,
);
router.post(
  "/update/:id",
  authUser,
  upload.single("image"),
  OccasionController.updateOccasion,
);

// Delete occasion by id
router.delete("/:id", authUser, OccasionController.deleteOccasion);

export default router;
