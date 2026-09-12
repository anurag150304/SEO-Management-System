import { Router } from "express";
import { HomepageController } from "@/controllers/homepage.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

const homepageUploads = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "aboutImage", maxCount: 1 },
]);

router.post(
  ["/", "/create"],
  authUser,
  homepageUploads,
  HomepageController.createHomepage,
);
router.get(["/", "/:id"], authUser, HomepageController.getHomepage);
router.put(
  ["/", "/:id"],
  authUser,
  homepageUploads,
  HomepageController.updateHomepage,
);
router.post(
  "/update",
  authUser,
  homepageUploads,
  HomepageController.updateHomepage,
);

export default router;
