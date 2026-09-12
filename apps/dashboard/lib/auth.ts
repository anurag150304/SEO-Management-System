import type { SignupInput, SigninInput } from "@repo/zod-validations";
import type { AuthResponse, SignoutResponse, ProfileResponse } from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/user.type";

export const authClient = {
  signup: async (payload: SignupInput): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<AuthResponse>("/auth/signup", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  signin: async (payload: SigninInput): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<AuthResponse>("/auth/signin", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  signout: async (): Promise<SignoutResponse> => {
    try {
      const res = await apiClient.get<SignoutResponse>("/auth/signout");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  profile: async (): Promise<ProfileResponse> => {
    try {
      const res = await apiClient.get<ProfileResponse>("/auth/me");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  hasAdmin: async (): Promise<{ hasAdmin: boolean }> => {
    try {
      const res = await apiClient.get<{ hasAdmin: boolean }>("/auth/has-admin");
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
