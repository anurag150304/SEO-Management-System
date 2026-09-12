export interface AuthUserPayload {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
