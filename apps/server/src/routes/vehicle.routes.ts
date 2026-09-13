import { Router } from "express";
import { VehicleController } from "@/controllers/vehicle.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.put("/reorder", authUser, VehicleController.reorderVehicles);
router.put("/:id/reorder", authUser, VehicleController.reorderVehicles);

router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  VehicleController.createVehicle,
);

router.get("/", authUser, VehicleController.getAllVehicles);
router.get("/:id", authUser, VehicleController.getVehicleById);
router.delete("/:id", authUser, VehicleController.deleteVehicle);

router.put(
  "/:id",
  authUser,
  upload.single("image"),
  VehicleController.updateVehicle,
);
router.post(
  "/update/:id",
  authUser,
  upload.single("image"),
  VehicleController.updateVehicle,
);


export default router;
