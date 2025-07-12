import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useLogout } from "~/mutations/auth/use-logout";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={() => logout()} disabled={isPending}>
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
