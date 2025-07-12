import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "~/components/ui/header";
import { auth } from "~/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Header session={session} />
      {children}
    </div>
  );
}
