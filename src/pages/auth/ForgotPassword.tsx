import { ForgotPasswordForm } from "@/components/forgot-password-form";

export function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-300">
      <ForgotPasswordForm className="w-full max-w-md" />
    </div>
  );
}
