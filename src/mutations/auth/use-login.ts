import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    async mutationFn({ email, password }: LoginMutation) {
      await authClient.signIn.email({
        email,
        password,
      });
    },
    onSuccess() {
      router.push("/");
    },
  });
}

interface LoginMutation {
  email: string;
  password: string;
}
