import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAction, type RegisterRequest } from '~/server/auth';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerAction(data),
    onSuccess() {
      router.push("/");
    },
  });
}
