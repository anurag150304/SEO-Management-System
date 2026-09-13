import { Router } from "express";
import { SchemaController } from "@/controllers/schema.controller";

const router: Router = Router();

router.post(["/", "/schemas"], SchemaController.createSchema);
router.get(["/", "/schemas"], SchemaController.getAllSchemas);

router.get(
  ["/:schemaType", "/schemas/:schemaType"],
  SchemaController.getSchema,
);

router.put(
  ["/:schemaType", "/schemas/:schemaType"],
  SchemaController.updateSchema,
);

router.delete(
  ["/:schemaType", "/schemas/:schemaType"],
  SchemaController.deleteSchema,
);

export default router;
