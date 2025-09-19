import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "./ui/password";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    // Basic RFC 5322 compliant regex for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (emailError && value) {
      setEmailError(null);
    }
  };

  const handleBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError(null);
    }

    // Dummy authentication check
    if (email === "test@email.com" && password === "password123") {
      setAuthError(null);
      navigate("/dashboard");
    } else {
      setAuthError("Invalid email or password");
    }
  };

  return (
    <Card className="w-full min-w-sm max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="flex flex-col items-center space-y-4">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-6", className)}
          {...props}
          noValidate
        >
          <div className="grid gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                className="h-12"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleBlur}
                error={emailError || undefined}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter password"
                className="h-12"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Auth error */}
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-800 hover:bg-blue-700"
            >
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
