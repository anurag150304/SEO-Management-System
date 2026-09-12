import { authClient } from "@/lib";
import type { SigninInput, SignupInput } from "@repo/zod-validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authClient.profile(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnReconnect: true,
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignupInput) => authClient.signup(payload),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      queryClient.setQueryData(authKeys.profile(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useSignin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SigninInput) => authClient.signin(payload),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      queryClient.setQueryData(authKeys.profile(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authClient.signout(),
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      queryClient.clear();
    },
  });
}

export function useHasAdmin() {
  return useQuery({
    queryKey: [...authKeys.all, "has-admin"],
    queryFn: () => authClient.hasAdmin(),
    staleTime: 1000 * 30,
  });
}
