import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutAction } from '~/server/auth';

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess() {
      router.push("/login");
    },
  });
}
