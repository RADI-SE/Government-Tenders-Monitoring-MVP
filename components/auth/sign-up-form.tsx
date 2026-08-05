"use client";

import { SignUp } from "@clerk/nextjs";

export function SignUpForm() {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
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
