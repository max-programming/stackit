import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    async mutationFn({ email, password }: LoginMutation) {
      await authClient.signIn.email({
        email,
        password,
      });
    },
    onSuccess() {
      navigate({ to: "/" });
    },
  });
}

interface LoginMutation {
  email: string;
  password: string;
}
