export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface SignoutResponse {
  message: string;
  success: boolean;
}

export interface ProfileResponse extends AuthUser {
  message?: string;
}
