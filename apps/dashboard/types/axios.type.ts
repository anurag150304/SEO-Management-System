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
        raw?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
        this.field = field;
        this.raw = raw;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    get isValidationError(): boolean {
        return (
            this.status === 422 ||
            Boolean(this.errors && Object.keys(this.errors).length > 0)
        );
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isForbidden(): boolean {
        return this.status === 403;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    get isConflict(): boolean {
        return this.status === 409;
    }

    getFirstError(): string {
        if (this.errors) {
            const firstEntry = Object.values(this.errors)[0];
            if (firstEntry?.[0]) {
                return firstEntry[0];
            }
        }
        return this.message;
    }

    getFieldError(fieldName: string): string | undefined {
        return this.errors?.[fieldName]?.[0];
    }
}