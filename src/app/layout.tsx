import type { Metadata } from "next";
import Providers from "./providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import Header from "~/components/ui/header";

export const metadata: Metadata = {
  title: "StackIt - The Modern Stack Overflow",
  description: "The Modern Stack Overflow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>
        <Providers>
          <Header session={session} />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  );
}
