import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    async mutationFn() {
      await authClient.signOut();
    },
    onSuccess() {
      navigate({ to: "/login" });
    },
  });
}
