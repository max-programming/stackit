import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    async mutationFn({ email, password, name }: RegisterMutation) {
      await authClient.signUp.email({
        email,
        password,
        name,
      });
    },
    onSuccess() {
      navigate({ to: "/" });
    },
  });
}

interface RegisterMutation {
  email: string;
  password: string;
  name: string;
}
