"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  roles: string[];
}

export const AuthGuard = ({ children, roles }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait until the auth context finishes its initial load
    if (!isLoading) {
      if (!user || !roles.includes(user.role)) {
        // Use replace() instead of push() to prevent back-button routing bugs
        router.replace("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [user, isLoading, router, roles]);

  // Cinematic loading state that matches your global theme
  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
