CREATE TYPE "role" AS ENUM('ADMIN', 'EDITOR');--> statement-breakpoint
CREATE TYPE "schema_enum" AS ENUM('ORGANISATION', 'FAQ', 'BREADCRUMB', 'WEBSITE', 'LOCAL_BUSINESS');--> statement-breakpoint
CREATE TABLE "blacklisted_tokens" (
	"id" serial PRIMARY KEY,
	"token" varchar(500) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_settings" (
	"id" serial PRIMARY KEY,
	"phone" varchar(30),
	"email" varchar(256),
	"address" text,
	"map_embed" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY,
	"image" varchar(500) NOT NULL,
	"alt_text" varchar(256) NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "homepage" (
	"id" serial PRIMARY KEY,
	"hero_heading" varchar(256),
	"hero_subheading" varchar(256),
	"hero_image" varchar(500),
	"hero_cta_text" varchar(100),
	"hero_cta_url" varchar(500),
	"about_title" varchar(256),
	"about_description" text,
	"about_image" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "occasions" (
	"id" serial PRIMARY KEY,
	"title" varchar(256) NOT NULL,
	"image" varchar(500),
	"description" text,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "schema" (
	"id" serial PRIMARY KEY,
	"schemaType" "schema_enum" NOT NULL UNIQUE,
	"schema_data" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" serial PRIMARY KEY,
	"meta_title" varchar(256),
	"meta_description" text,
	"focus_keywords" json,
	"canonical_url" varchar(500),
	"robots_index" boolean DEFAULT true,
	"robots_follow" boolean DEFAULT true,
	"og_title" varchar(256),
	"og_description" text,
	"og_image" varchar(500),
	"twitter_title" varchar(256),
	"twitter_description" text,
	"twitter_image" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY,
	"customer_name" varchar(256) NOT NULL,
	"rating" smallint NOT NULL,
	"review" text NOT NULL,
	"image" varchar(500),
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL UNIQUE,
	"password_hash" varchar(256) NOT NULL,
	"role" "role" DEFAULT 'EDITOR'::"role" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "vehicle" (
	"id" serial PRIMARY KEY,
	"title" varchar(256) NOT NULL,
	"seating_capacity" smallint,
	"description" text,
	"image" varchar(500),
	"features" json,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
