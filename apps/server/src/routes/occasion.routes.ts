import { Router } from "express";
import { OccasionController } from "@/controllers/occasion.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.put("/reorder", authUser, OccasionController.reorderOccasions);
router.put("/:id/reorder", authUser, OccasionController.reorderOccasions);

router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  OccasionController.createOccasion,
);

router.get("/", authUser, OccasionController.getAllOccasions);

router.get("/:id", authUser, OccasionController.getOccasionById);

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

router.delete("/:id", authUser, OccasionController.deleteOccasion);

export default router;
