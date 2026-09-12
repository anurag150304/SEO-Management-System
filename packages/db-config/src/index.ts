import * as models from "./db/schema";
import { db } from "./db/db";

export { models, db };
export type {
  SchemaRecord,
  NewSchemaRecord,
  SchemaEnumType,
  HomepageRecord,
  NewHomepageRecord,
  VehicleRecord,
  NewVehicleRecord,
  OccasionRecord,
  NewOccasionRecord,
  TestimonialRecord,
  NewTestimonialRecord,
  GalleryRecord,
  NewGalleryRecord,
  ContactSettingsRecord,
  NewContactSettingsRecord,
} from "./db/schema";
export {
  sql,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  and,
  desc,
  asc,
  DrizzleQueryError,
} from "drizzle-orm";
