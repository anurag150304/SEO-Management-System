import { ApiError, type BackendErrorResponse } from "@/types";
import axios, { AxiosError } from "axios";

const baseURL = process.env.NODE_ENV === "production" ?
  process.env.NEXT_API_URL : "http://localhost:8000";
const basePath = process.env.NEXT_API_PATH || "/api/v1";

export const apiClient = axios.create({
  baseURL: `${baseURL}${basePath}/dashboard`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15_000,
});

export function handleAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<BackendErrorResponse>;
    const status = err.response?.status;
    const data = err.response?.data;

    // Handle Network / Timeout issues
    if (!err.response) {
      if (err.code === "ECONNABORTED") {
        return new ApiError(
          "Request timed out due to render free tier usage. Please refresh once again.",
          status,
        );
      }
      return new ApiError(
        "Network error. Unable to reach the backend server. Please ensure the server is running.",
        status,
      );
    }

    let detailMessage = "An unexpected error occurred. Please try again.";
    let fieldErrors: Record<string, string[]> | undefined = undefined;
    let field: string | undefined = undefined;

    // Getting our defined errors
    if (data) {
      fieldErrors = data.errors;
      field = data.field;

      // Zod Validation Errors
      if (data.errors) {
        const firstField = Object.keys(data.errors)[0];
        const firstMessage = firstField ? data.errors[firstField]?.[0] : null;

        detailMessage =
          firstMessage ||
          data.error ||
          data.message ||
          "Validation failed. Please check the entered fields.";
      }

      // Not Found error
      else if (data.error === "Resource not found" && data.message) {
        detailMessage = data.message;
      }
      // Multer File Upload Errors
      else if (data.field && data.error) {
        detailMessage = `${data.error} (${data.field})`;
      }
      // Custom Application Errors
      else if (data.error) {
        detailMessage = data.error;
      }
      // Standard Message
      else if (data.message) {
        detailMessage = data.message;
      }

      return new ApiError(detailMessage, status, fieldErrors, field, data);
    }

    // Default Error
    return new ApiError(
      err.message || "An unexpected error occurred.",
      status,
      undefined,
      undefined,
      data,
    );
  }

  // Client Based Error
  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unknown error occurred.");
}

// Request Interceptor (middleware or pre-hook): Handles FormData boundary & Optional Bearer token header
apiClient.interceptors.request.use(
  (config) => {
    // If sending FormData, delete Content-Type so browser sets boundary automatically
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    // Attaching Bearer token from localStorage if present
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token");

      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(handleAxiosError(error)),
);

// Mapping all errors to ApiError
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleAxiosError(error)),
);
