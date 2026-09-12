import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const common = {
  id: serial("id").primaryKey(),
  do: integer("display_order").notNull(),
  ts: {
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
};

export const roleEnum = pgEnum("role", ["ADMIN", "EDITOR"]);
export const users = pgTable("user", {
  id: common.id,
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  role: roleEnum().notNull().default("EDITOR"),
  ...common.ts,
});

export const blacklistedTokens = pgTable("blacklisted_tokens", {
  id: common.id,
  token: varchar("token", { length: 500 }).notNull().unique(),
  createdAt: common.ts.createdAt,
});

export const schemaEnum = pgEnum("schema_enum", [
  "ORGANISATION",
  "FAQ",
  "BREADCRUMB",
  "WEBSITE",
  "LOCAL_BUSINESS",
]);
export const schemas = pgTable("schema", {
  id: common.id,
  schemaType: schemaEnum().notNull().unique(),
  schemaData: json("schema_data").notNull(),
  ...common.ts,
});

export const seoMetadata = pgTable("seo_metadata", {
  id: common.id,
  metaTitle: varchar("meta_title", { length: 256 }),
  metaDescription: text("meta_description"),
  focusKeywords: json("focus_keywords"),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  robotsIndex: boolean("robots_index").default(true),
  robotsFollow: boolean("robots_follow").default(true),
  ogTitle: varchar("og_title", { length: 256 }),
  ogDescription: text("og_description"),
  ogImage: varchar("og_image", { length: 500 }),
  twitterTitle: varchar("twitter_title", { length: 256 }),
  twitterDescription: text("twitter_description"),
  twitterImage: varchar("twitter_image", { length: 500 }),
  ...common.ts,
});

export const homepage = pgTable("homepage", {
  id: common.id,
  heroHeading: varchar("hero_heading", { length: 256 }),
  heroSubheading: varchar("hero_subheading", { length: 256 }),
  heroImage: varchar("hero_image", { length: 500 }),
  heroCtaText: varchar("hero_cta_text", { length: 100 }),
  heroCtaUrl: varchar("hero_cta_url", { length: 500 }),
  aboutTitle: varchar("about_title", { length: 256 }),
  aboutDescription: text("about_description"),
  aboutImage: varchar("about_image", { length: 500 }),
  ...common.ts,
});

export const vehicles = pgTable("vehicle", {
  id: common.id,
  title: varchar("title", { length: 256 }).notNull(),
  seatingCapacity: smallint("seating_capacity"),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  features: json("features"),
  displayOrder: common.do,
  ...common.ts,
});

export const occasions = pgTable("occasions", {
  id: common.id,
  title: varchar("title", { length: 256 }).notNull(),
  image: varchar("image", { length: 500 }),
  description: text("description"),
  displayOrder: common.do,
  ...common.ts,
});

export const testimonials = pgTable("testimonials", {
  id: common.id,
  customerName: varchar("customer_name", { length: 256 }).notNull(),
  rating: smallint("rating").notNull(),
  review: text("review").notNull(),
  image: varchar("image", { length: 500 }),
  displayOrder: common.do,
  ...common.ts,
});

export const gallery = pgTable("gallery", {
  id: common.id,
  image: varchar("image", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 256 }).notNull(),
  displayOrder: common.do,
  ...common.ts,
});

export const contactSettings = pgTable("contact_settings", {
  id: common.id,
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 256 }),
  address: text("address"),
  mapEmbed: text("map_embed"),
  ...common.ts,
});

export type SchemaRecord = typeof schemas.$inferSelect;
export type NewSchemaRecord = typeof schemas.$inferInsert;
export type SchemaEnumType = (typeof schemaEnum.enumValues)[number];

export type HomepageRecord = typeof homepage.$inferSelect;
export type NewHomepageRecord = typeof homepage.$inferInsert;

export type VehicleRecord = typeof vehicles.$inferSelect;
export type NewVehicleRecord = typeof vehicles.$inferInsert;

export type OccasionRecord = typeof occasions.$inferSelect;
export type NewOccasionRecord = typeof occasions.$inferInsert;

export type TestimonialRecord = typeof testimonials.$inferSelect;
export type NewTestimonialRecord = typeof testimonials.$inferInsert;

export type GalleryRecord = typeof gallery.$inferSelect;
export type NewGalleryRecord = typeof gallery.$inferInsert;

export type ContactSettingsRecord = typeof contactSettings.$inferSelect;
export type NewContactSettingsRecord = typeof contactSettings.$inferInsert;
