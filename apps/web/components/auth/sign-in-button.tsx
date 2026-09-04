"use client";

import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SignInButtonProps = {
  callbackUrl?: string;
} & Omit<ComponentProps<typeof Button>, "onClick">;

export function SignInButton({
  callbackUrl,
  disabled,
  ...props
}: SignInButtonProps) {
  const fallback = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}${window.location.hash}` : "/sessions";
  const redirectUrl = callbackUrl ?? fallback;
  
  return (
    <Button
      {...props}
      disabled={disabled}
      asChild
    >
      <Link href={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}>
        Sign in / Register
      </Link>
    </Button>
  );
}
