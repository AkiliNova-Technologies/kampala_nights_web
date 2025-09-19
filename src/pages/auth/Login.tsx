import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-bg.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 ">
        <div className="flex flex-col items-center w-full max-w-md gap-6">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-32 w-32"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
