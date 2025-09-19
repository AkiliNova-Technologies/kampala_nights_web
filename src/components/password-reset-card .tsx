import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function PasswordResetCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <Card className="w-full min-w-sm max-w-md mx-auto shadow-lg border-0 pt-0">
      <CardHeader className="flex flex-col items-center space-y-4">
        <img
          src="/Concord.png"
          alt="reminder"
          className="h-52 w-52 my-0"
        />
        <CardTitle className="text-2xl font-bold text-center">
          Your password is changed
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <p className="text-center">
            Your password has been successfully updated. Your account's security
            is our priority.
          </p>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-800 hover:bg-blue-700"
          >
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
