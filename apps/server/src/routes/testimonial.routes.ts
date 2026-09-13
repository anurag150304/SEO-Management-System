import { Router } from "express";
import { TestimonialController } from "@/controllers/testimonial.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.put("/reorder", authUser, TestimonialController.reorderTestimonials);
router.put("/:id/reorder", authUser, TestimonialController.reorderTestimonials);

router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  TestimonialController.createTestimonial,
);

router.get("/", authUser, TestimonialController.getAllTestimonials);
router.get("/:id", authUser, TestimonialController.getTestimonialById);
router.delete("/:id", authUser, TestimonialController.deleteTestimonial);

router.put(
  "/:id",
  authUser,
  upload.single("image"),
  TestimonialController.updateTestimonial,
);
router.post(
  "/update/:id",
  authUser,
  upload.single("image"),
  TestimonialController.updateTestimonial,
);


export default router;
