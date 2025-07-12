import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    async mutationFn() {
      await authClient.signOut();
    },
    onSuccess() {
      router.push("/login");
    },
  });
}
