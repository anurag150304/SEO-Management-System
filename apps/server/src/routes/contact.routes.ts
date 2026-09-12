import { Router } from "express";
import { ContactController } from "@/controllers/contact.controller";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Create contact settings (or update if already exists)
router.post(
  ["/", "/create"],
  authUser,
  ContactController.createContactSettings,
);

// Read contact settings (latest or by id)
router.get(["/", "/:id"], authUser, ContactController.getContactSettings);

// Update contact settings (by id in params, or active record)
router.put(["/", "/:id"], authUser, ContactController.updateContactSettings);
router.post("/update", authUser, ContactController.updateContactSettings);

export default router;
