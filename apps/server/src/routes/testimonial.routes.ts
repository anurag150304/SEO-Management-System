import { Router } from "express";
import { TestimonialController } from "@/controllers/testimonial.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Reorder testimonials (must precede /:id)
router.put("/reorder", authUser, TestimonialController.reorderTestimonials);
router.put("/:id/reorder", authUser, TestimonialController.reorderTestimonials);

// Create testimonial
router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  TestimonialController.createTestimonial,
);

// Read all testimonials
router.get("/", authUser, TestimonialController.getAllTestimonials);

// Read single testimonial by id
router.get("/:id", authUser, TestimonialController.getTestimonialById);

// Update testimonial by id
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

// Delete testimonial by id
router.delete("/:id", authUser, TestimonialController.deleteTestimonial);

export default router;
