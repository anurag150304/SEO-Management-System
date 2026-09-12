import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api/v1";

export const apiClient = axios.create({
    baseURL: `${baseURL}${basePath}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 15_000,
});

export interface BackendErrorResponse {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
    field?: string;
    status?: number;
}

export class ApiError extends Error {
    status?: number;
    errors?: Record<string, string[]>;
    field?: string;
    raw?: unknown;

    constructor(
        message: string,
        status?: number,
        errors?: Record<string, string[]>,
        field?: string,
        raw?: unknown
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
        this.field = field;
        this.raw = raw;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

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
                    "Request timed out. Please check your connection and try again.",
                    status
                );
            }
            return new ApiError(
                "Network error. Unable to reach the backend server. Please ensure the server is running.",
                status
            );
        }

        let detailMessage = "An unexpected error occurred. Please try again.";
        let fieldErrors: Record<string, string[]> | undefined = undefined;
        let field: string | undefined = undefined;

        // Getting our defined errors
        if (data && typeof data === "object") {
            fieldErrors = data.errors;
            field = data.field;

            // Zod Validation Errors
            if (data.errors && typeof data.errors === "object") {
                const firstField = Object.keys(data.errors)[0];
                const firstMessage = firstField ? data.errors[firstField]?.[0] : null;

                detailMessage =
                    firstMessage ||
                    data.error ||
                    data.message ||
                    "Validation failed. Please check the entered fields.";
            }

            // Not Found error
            else if (
                data.error === "Resource not found" &&
                data.message
            ) {
                detailMessage = data.message;
            }
            // Multer File Upload Errors
            else if (data.field && data.error) {
                detailMessage = `${data.error} (${data.field})`;
            }
            // Custom Application Errors
            else if (data.error && typeof data.error === "string") {
                detailMessage = data.error;
            }
            // Standard Message
            else if (data.message && typeof data.message === "string") {
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
            data
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

        // Attach Bearer token from localStorage if present (supplements HTTP-only cookie)
        if (typeof window !== "undefined") {

            const token = localStorage.getItem("auth_token") || localStorage.getItem("token");

            if (token && config.headers && !config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(handleAxiosError(error))
);

// Response Interceptor: Seamlessly maps all errors to ApiError
apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleAxiosError(error))
);
