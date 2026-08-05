"use client";

import { SignIn } from "@clerk/nextjs";

export function SignInForm() {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      forceRedirectUrl="/dashboard"
      fallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          card: "shadow-none border-0 bg-transparent",
          rootBox: "w-full",
        },
      }}
    />
  );
}
