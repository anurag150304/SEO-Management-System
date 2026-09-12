import { Router } from "express";
import { VehicleController } from "@/controllers/vehicle.controller";
import { upload } from "@/middlewares/multer.middleware";
import { authUser } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Reorder vehicles (must precede /:id)
router.put("/reorder", authUser, VehicleController.reorderVehicles);
router.put("/:id/reorder", authUser, VehicleController.reorderVehicles);

// Create vehicle
router.post(
  ["/", "/create"],
  authUser,
  upload.single("image"),
  VehicleController.createVehicle,
);

// Read vehicles (list all)
router.get("/", authUser, VehicleController.getAllVehicles);

// Read single vehicle by id
router.get("/:id", authUser, VehicleController.getVehicleById);

// Update vehicle by id
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

// Delete vehicle by id
router.delete("/:id", authUser, VehicleController.deleteVehicle);

export default router;
