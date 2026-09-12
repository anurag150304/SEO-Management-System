import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import testimonialRoute from "@/routes/testimonial.routes";
import homepageRoute from "@/routes/homepage.routes";
import occasionRoute from "@/routes/occasion.routes";
import vehicleRoute from "@/routes/vehicle.routes";
import galleryRoute from "@/routes/gallery.routes";
import contactRoute from "@/routes/contact.routes";
import { CTError } from "@/utils/errHandler.util";
import schemaRoute from "@/routes/schema.routes";
import authRoute from "@/routes/auth.routes";
import seoRoute from "@/routes/seo.routes";
import cookieParser from "cookie-parser";
import { env } from "@repo/env-config";
import { MulterError } from "multer";
import morgan from "morgan";
import cors from "cors";

const app: Express = express();
const basePath: string = env.BASE_PATH || "/api/v1";

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Logging & Parsing Middlewares
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check & Root Endpoints
const healthHandler = (_: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    message: "SEO Management API is running",
    timestamp: new Date().toISOString(),
    basePath,
  });
};

app.get("/", healthHandler);
app.get("/health", healthHandler);
app.get(basePath, healthHandler);

// API Routes
app.use(`${basePath}/auth`, authRoute);
app.use(`${basePath}/seo`, seoRoute);
app.use(`${basePath}/schemas`, schemaRoute);
app.use(`${basePath}/homepage`, homepageRoute);
app.use(`${basePath}/vehicles`, vehicleRoute);
app.use(`${basePath}/occasions`, occasionRoute);
app.use(`${basePath}/testimonials`, testimonialRoute);
app.use(`${basePath}/gallery`, galleryRoute);
app.use(`${basePath}/contact`, contactRoute);
app.use(`${basePath}/contact-settings`, contactRoute);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: "Resource not found",
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// Global Error Handling Middleware
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Custom error (CTError)
  if (err instanceof CTError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Multer upload errors
  if (err instanceof MulterError) {
    return res.status(400).json({
      error: `File upload error: ${err.message}`,
      field: err.field,
    });
  }

  // JSON syntax error from invalid request body (for zod validation)
  if (
    err instanceof SyntaxError &&
    "body" in err &&
    (err as any).status === 400
  ) {
    return res.status(400).json({
      error: "Malformed JSON in request body.",
    });
  }

  // Generic error fallback
  const errorObj = err as any;
  const status =
    typeof errorObj?.status === "number" &&
    errorObj.status >= 400 &&
    errorObj.status < 600
      ? errorObj.status
      : 500;

  const message =
    status === 500 && env.NODE_ENV === "production"
      ? "Internal Server Error"
      : errorObj?.message || "Something went wrong!";

  if (status === 500) {
    console.error(`[UnhandledError] ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(status).json({ error: message });
});

export default app;
