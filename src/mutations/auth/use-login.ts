import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginAction, type LoginRequest } from '~/server/auth';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginAction(data),
    onSuccess() {
      router.push("/");
    },
  });
}

