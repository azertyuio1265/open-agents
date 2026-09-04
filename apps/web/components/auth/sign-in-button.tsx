"use client";

import { ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { GoogleIcon } from "@/components/provider-icons";
import { Loader2 } from "lucide-react";

type SignInButtonProps = {
  callbackUrl?: string;
} & Omit<ComponentProps<typeof Button>, "onClick">;

export function SignInButton({
  callbackUrl,
  disabled,
  ...props
}: SignInButtonProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const fallback = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}${window.location.hash}` : "/sessions";
  const redirectUrl = callbackUrl ?? fallback;

  const handleSignIn = async (provider: "google" | "vercel" | "github") => {
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: redirectUrl,
      });
    } catch (err) {
      console.error(err);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Button
        {...props}
        disabled={disabled || loadingProvider !== null}
        onClick={() => handleSignIn("google")}
        className="gap-2 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
      >
        {loadingProvider === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Sign in with Google
      </Button>
      <Button
        {...props}
        disabled={disabled || loadingProvider !== null}
        onClick={() => handleSignIn("vercel")}
        variant="outline"
        className="gap-2"
      >
        {loadingProvider === "vercel" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="h-4 w-4 font-bold">▲</span>
        )}
        Sign in with Vercel
      </Button>
    </div>
  );
}
