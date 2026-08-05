// app/(auth)/sign-in/[[...sign-in]]/page.tsx

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function Page() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}