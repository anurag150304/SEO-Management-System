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
import publicRoute from "@/routes/public.routes";
import authRoute from "@/routes/auth.routes";
import seoRoute from "@/routes/seo.routes";
import cookieParser from "cookie-parser";
import { env } from "@repo/env-config";
import { MulterError } from "multer";
import morgan from "morgan";
import cors from "cors";

const app: Express = express();
const basePath: string = env.BASE_PATH || "/api/v1";
const dashboardPath: string = `${basePath}/dashboard`;
const publicPath: string = `${basePath}/public`;

// CORS Configuration
app.use(
  cors({
    origin: env.NODE_ENV === "production" ?
      [env.DASHBOARD_URL, env.PUBLIC_URL] :
      ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Logging & Parsing Middlewares
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Server Health Check
const healthHandler = (base: string) => {
  return {
    status: "ok",
    message: `${base} API is running`,
    timestamp: new Date().toISOString(),
    basePath,
  };
};

app.get("/", (_: Request, res: Response) =>
  res.status(200).json(healthHandler("SEO Management")),
);
app.get("/health", (_: Request, res: Response) =>
  res.status(200).json(healthHandler("SEO Management")),
);
app.get(dashboardPath, (_: Request, res: Response) =>
  res.status(200).json(healthHandler("SEO Dashboard")),
);
app.get(publicPath, (_: Request, res: Response) =>
  res.status(200).json(healthHandler("SEO ManagemPublic")),
);

// Dashboard API Routes
app.use(`${dashboardPath}/seo`, seoRoute);
app.use(`${dashboardPath}/auth`, authRoute);
app.use(`${dashboardPath}/schemas`, schemaRoute);
app.use(`${dashboardPath}/contact`, contactRoute);
app.use(`${dashboardPath}/gallery`, galleryRoute);
app.use(`${dashboardPath}/vehicles`, vehicleRoute);
app.use(`${dashboardPath}/homepage`, homepageRoute);
app.use(`${dashboardPath}/occasions`, occasionRoute);
app.use(`${dashboardPath}/testimonials`, testimonialRoute);
app.use(`${dashboardPath}/contact-settings`, contactRoute);

// Public API Route
app.use(publicPath, publicRoute);

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
    console.error(`UnhandledError:  ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(status).json({ error: message });
});

export default app;
