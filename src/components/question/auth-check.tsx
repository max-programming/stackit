"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LogIn, Lock } from "lucide-react";
import Link from "next/link";

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isAuthenticated: boolean;
}

export function AuthCheck({
  children,
  fallback,
  isAuthenticated,
}: AuthCheckProps) {
  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Authentication Required
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground mb-4">
          You need to be logged in to perform this action.
        </p>
        <Link href="/login">
          <Button>
            <LogIn className="w-4 h-4 mr-2" />
            Log in
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
