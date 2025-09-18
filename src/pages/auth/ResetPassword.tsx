import { ResetPasswordForm } from "@/components/reset-password-form";

export function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-300">
      <ResetPasswordForm className="w-full max-w-md" />
    </div>
  );
}
