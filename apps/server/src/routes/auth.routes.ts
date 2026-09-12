import { AuthController } from "@/controllers/auth.controller";
import { authUser } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/signout", authUser, AuthController.signout);
router.get("/me", authUser, AuthController.profile);

export default router;
