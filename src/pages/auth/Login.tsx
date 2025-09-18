import { LoginForm } from "@/components/login-form";

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-300">
      <LoginForm className="w-full max-w-md" />
    </div>
  );
}
