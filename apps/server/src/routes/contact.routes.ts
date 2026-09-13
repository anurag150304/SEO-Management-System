import { Router } from "express";
import { ContactController } from "@/controllers/contact.controller";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post(
  ["/", "/create"],
  authUser,
  ContactController.createContactSettings,
);

router.get(["/", "/:id"], authUser, ContactController.getContactSettings);

router.put(["/", "/:id"], authUser, ContactController.updateContactSettings);
router.post("/update", authUser, ContactController.updateContactSettings);

export default router;
