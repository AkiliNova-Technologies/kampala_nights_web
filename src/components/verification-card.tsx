import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";

export function EmailVerification({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <Card className="w-full min-w-sm max-w-md mx-auto shadow-lg border-0 pt-0">
      <CardHeader className="flex flex-col items-center space-y-4">
        <img
          src="/Reminder.png"
          alt="reminder"
          className="h-52 w-52 my-0"
        />
        <CardTitle className="text-2xl font-bold text-center">
          Check your email
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <p className="text-center">
            We have sent a verification code to your email <b>{email}</b> to
            verify your account. Thank you
          </p>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-800 hover:bg-blue-700"
          >
            Back to login
          </Button>
        </form>
        <div className="flex flex-1 flex-row items-center justify-center mt-5">
          <p>Didn't receive an email?</p>
          <Button
            type="button"
            variant={"link"}
            className="text-blue-600 bg-transparent hover:bg-transparent text-md"
          >
            Resend
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}