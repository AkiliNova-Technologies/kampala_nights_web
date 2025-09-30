import { PasswordResetCard } from "@/components/password-reset-card ";

export function PasswordResetPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
          <div className="bg-muted relative hidden lg:block">
            <img
              src="/login-bg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
    
          <div className="flex items-center justify-center p-6 md:px-10 ">
            <div className="flex flex-col items-center w-full max-w-md gap-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-32 w-32"
              />
              <PasswordResetCard />
            </div>
          </div>
        </div>
  );
}
