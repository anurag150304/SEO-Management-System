import type { SignupInput, SigninInput } from "@repo/zod-validations";
import { apiClient, handleAxiosError } from "./api/client";

export const authClient = {
    signup: async (payload: SignupInput) => {
        try {
            const res = await apiClient.post<{ token: string; user: SignupInput }>("/auth/signup", payload);
            return res.data;
        } catch (err) {
            throw handleAxiosError(err);
        }
    },

    signin: async (payload: SigninInput) => {
        try {
            const res = await apiClient.post<{ token: string; }>("/auth/signin", payload);
            return res.data;
        } catch (err) {
            throw handleAxiosError(err);
        }
    },

    signout: async () => {
        try {
            const res = await apiClient.get<{ success: boolean; }>("/auth/signout");
            res.data?.success;
        } catch (err) {
            throw handleAxiosError(err);
        }
    },

    profile: async () => {
        try {
            const res = await apiClient.get<SignupInput & { id: number }>("/auth/me");
            res.data;
        } catch (err) {
            throw handleAxiosError(err);
        }
    }
}
