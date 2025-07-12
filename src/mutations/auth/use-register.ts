import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    async mutationFn({ email, password, name }: RegisterMutation) {
      await authClient.signUp.email({
        email,
        password,
        name,
      });
    },
    onSuccess() {
      router.push("/");
    },
  });
}

interface RegisterMutation {
  email: string;
  password: string;
  name: string;
}
