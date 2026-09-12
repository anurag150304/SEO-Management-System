import { Router } from "express";
import { SchemaController } from "@/controllers/schema.controller";

const router: Router = Router();

// Create schema (or upsert if schemaType already exists)
router.post(["/", "/schemas"], SchemaController.createSchema);

// Read all schemas
router.get(["/", "/schemas"], SchemaController.getAllSchemas);

// Read schema by schemaType (e.g. /schemas/ORGANISATION, /schemas/FAQ, or ID)
router.get(["/:schemaType", "/schemas/:schemaType"], SchemaController.getSchema);

// Update schema by schemaType (or ID)
router.put(["/:schemaType", "/schemas/:schemaType"], SchemaController.updateSchema);

// Delete schema by schemaType (or ID)
router.delete(["/:schemaType", "/schemas/:schemaType"], SchemaController.deleteSchema);

export default router;
