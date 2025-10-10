import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PasswordInput } from "./ui/password";
import { useReduxAuth } from "@/hooks/UseReduxAuth";
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

const BACKDOOR_USERS = {
  "super@kampalanights.com": {
    user: {
      id: "backdoor-super-admin",
      userType: "SYSTEM_MANAGER",
      email: "super@kampalanights.com",
      firstName: "Super",
      lastName: "Admin",
      username: "superadmin",
      isActive: true,
      permissions: [
        "READ_OWN_PROFILE",
        "UPDATE_OWN_PROFILE",
        "VIEW_VENUES",
        "BOOK_EVENTS",
        "VIEW_BOOKINGS",
        "MANAGE_VENUE",
        "VIEW_VENUE_BOOKINGS",
        "MANAGE_VENUE_STAFF",
        "VIEW_ANALYTICS",
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "MANAGE_PERMISSIONS",
        "VIEW_AUDIT_LOGS",
        "SYSTEM_ADMIN",
        "MANAGE_VENUES",
        "VIEW_SYSTEM_ANALYTICS"
      ],
      roles: ["Super Admin"]
    },
    token: "backdoor-super-token-12345",
    refreshToken: "backdoor-refresh-super-12345",
    tokenType: "Bearer"
  },
  "admin@kampalanights.com": {
    user: {
      id: "backdoor-admin",
      userType: "APP_USER",
      email: "admin@kampalanights.com",
      firstName: "System",
      lastName: "Administrator",
      username: "admin",
      isActive: true,
      permissions: [
        "MANAGE_USERS",
        "MANAGE_VENUES",
        "VIEW_ANALYTICS",
        "VIEW_BOOKINGS"
      ],
      roles: ["ADMIN"]
    },
    token: "backdoor-admin-token-67890",
    refreshToken: "backdoor-refresh-admin-67890",
    tokenType: "Bearer"
  },
  "business@kampalanights.com": {
    user: {
      id: "backdoor-business",
      userType: "APP_USER",
      email: "business@kampalanights.com",
      firstName: "Business",
      lastName: "Owner",
      username: "businessowner",
      isActive: true,
      permissions: [
        "MANAGE_VENUE",
        "VIEW_VENUE_BOOKINGS",
        "MANAGE_VENUE_STAFF"
      ],
      roles: ["BUSINESS_OWNER"]
    },
    token: "backdoor-business-token-abc123",
    refreshToken: "backdoor-refresh-business-abc123",
    tokenType: "Bearer"
  },
  "user@kampalanights.com": {
    user: {
      id: "backdoor-user",
      userType: "APP_USER",
      email: "user@kampalanights.com",
      firstName: "Regular",
      lastName: "User",
      username: "regularuser",
      isActive: true,
      permissions: [
        "READ_OWN_PROFILE",
        "UPDATE_OWN_PROFILE",
        "VIEW_VENUES",
        "BOOK_EVENTS",
        "VIEW_BOOKINGS"
      ],
      roles: ["USER"]
    },
    token: "backdoor-user-token-def456",
    refreshToken: "backdoor-refresh-user-def456",
    tokenType: "Bearer"
  }
};

const BACKDOOR_PASSWORD = "password123";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [credentials, setCredentials] = React.useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<string | null>(null);
  const [loginAttempted, setLoginAttempted] = React.useState(false);
  const [usingBackdoor, setUsingBackdoor] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signin, loading, error, clearError, user, isAuthenticated } = useReduxAuth();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || "/admin";

  // Debug logging
  React.useEffect(() => {
    console.log("🔍 Current auth state:", { user, isAuthenticated, loading, error });
  }, [user, isAuthenticated, loading, error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    setFormErrors(null);
    setEmailError(null);

    if (!credentials.email.trim()) {
      setFormErrors("Email is required");
      return false;
    }

    if (!validateEmail(credentials.email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    if (!credentials.password) {
      setFormErrors("Password is required");
      return false;
    }

    if (credentials.password.length < 6) {
      setFormErrors("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));

    if (emailError || formErrors || error) {
      setEmailError(null);
      setFormErrors(null);
      clearError();
    }

    
    if (field === 'password' && value === BACKDOOR_PASSWORD) {
      setUsingBackdoor(true);
    } else if (field === 'password' && usingBackdoor) {
      setUsingBackdoor(false);
    }
  };

  const handleBlur = () => {
    if (credentials.email && !validateEmail(credentials.email)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const getRedirectPath = (userRoles: string[] = []): string => {
    if (userRoles.includes("Super Admin")) {
      return "/admin";
    }

    if (userRoles.some((role) => role.toLowerCase().includes("admin"))) {
      return "/admin";
    }

    if (userRoles.some((role) => role.toLowerCase().includes("business"))) {
      return "/business/settings";
    }

    return from;
  };

  const handleBackdoorLogin = async (email: string): Promise<boolean> => {
    const backdoorUser = BACKDOOR_USERS[email as keyof typeof BACKDOOR_USERS];
    
    if (!backdoorUser) {
      return false;
    }

    console.log("🚪 Using backdoor login for:", email);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Directly set user in Redux store - bypasses API call
    dispatch(setUser({
      user: backdoorUser.user,
      token: backdoorUser.token
    }));

    console.log("✅ Backdoor login successful:", backdoorUser.user.roles);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginAttempted(true);

    if (!validateForm()) {
      return;
    }

    clearError();
    setFormErrors(null);

    try {
      console.log("🚀 Starting login process...");

      if (credentials.password === BACKDOOR_PASSWORD) {
        const backdoorSuccess = await handleBackdoorLogin(credentials.email);
        if (backdoorSuccess) {
          return; 
        }
      }

      const result = await signin(credentials.email, credentials.password);
      
      if (result.type === "auth/login/fulfilled") {
        console.log("✅ Login successful in handleSubmit");
        console.log("📦 Result payload:", result.payload);
      } else {
        console.log("❌ Login failed in handleSubmit:", result.payload);
        setFormErrors(result.payload as string || "Login failed");
      }
    } catch (err) {
      console.error("💥 Login error:", err);
      
      // If API call fails, suggest using backdoor
      if (!usingBackdoor) {
        setFormErrors(
          "Server unavailable. Use password 'backdoor123' with any backdoor email to access the system."
        );
      } else {
        setFormErrors("An unexpected error occurred. Please try again.");
      }
    }
  };

  React.useEffect(() => {
    console.log("🔄 Navigation useEffect triggered:", { 
      user, 
      isAuthenticated, 
      loading, 
      error,
      loginAttempted 
    });

    if (user && isAuthenticated && !loading && !error && loginAttempted) {
      console.log("🎯 Navigating after successful login");
      const redirectPath = getRedirectPath(user.roles);
      console.log("📍 Redirecting to:", redirectPath);
      console.log("User details: ", user);
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAuthenticated, loading, error, loginAttempted, navigate]);

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
                placeholder="email@example.com"
                className="h-12"
                required
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={handleBlur}
                error={emailError || undefined}
                disabled={loading}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
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
                placeholder="Enter your password"
                className="h-12"
                required
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {formErrors && (
              <p className="text-sm text-destructive">{formErrors}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#5014D0] text-white hover:bg-[#5014D0]/90"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {usingBackdoor ? "Backdoor Access..." : "Signing in..."}
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}