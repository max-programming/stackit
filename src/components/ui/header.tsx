/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useLogout } from "~/mutations/auth/use-logout";
import Link from "next/link";

function Header({ session }: { session: any | null }) {
  const { mutate: logout } = useLogout();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo-stackit.png"
          alt="Stackit Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
        />
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-3">
        {/* Notification button - only show if logged in */}

        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-2 rounded-full p-1 h-auto"
              >
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                    session.user?.name || session.user?.email
                  }`}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium border-b">
                  {session.user?.name || session.user?.email}
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
