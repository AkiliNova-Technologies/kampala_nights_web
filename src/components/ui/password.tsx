import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  showStrength?: boolean
  error?: boolean
  errorMessage?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, error = false, errorMessage, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalPassword, setInternalPassword] = React.useState("")

    // Sync with external value if provided
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalPassword(value as string);
      }
    }, [value]);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalPassword(newValue);
      onChange?.(e);
    }

    // Password strength logic
    const getPasswordStrength = () => {
      if (internalPassword.length === 0) return { strength: 0, label: "", color: "" }
      if (internalPassword.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" }
      if (internalPassword.length < 10) return { strength: 50, label: "Medium", color: "bg-yellow-500" }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(internalPassword)) {
        return { strength: 75, label: "Strong", color: "bg-green-500" }
      }
      return { strength: 100, label: "Very Strong", color: "bg-green-600" }
    }

    const strength = getPasswordStrength()

    return (
      <div className="flex flex-col gap-2">
        {/* Input wrapper ensures icon stays aligned */}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-[#5014D0] focus-visible:ring-[1px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              error && "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
              className
            )}
            value={internalPassword}
            onChange={handleInputChange}
            {...props}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {showStrength && internalPassword.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Password strength:</span>
              <span className="font-medium">{strength.label}</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn("w-full h-full transition-all duration-300 rounded-full", strength.color)}
                style={{ width: `${strength.strength}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message with icon */}
        {error && errorMessage && (
          <p className="mt-1 text-sm text-destructive flex items-start gap-1">
            <span className="h-1 w-1 rounded-full bg-destructive mt-1.5 flex-shrink-0"></span>
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }