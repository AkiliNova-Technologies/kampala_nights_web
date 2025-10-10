import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg border-2 relative",
          
          // Description text
          description: "group-[.toast]:text-muted-foreground",
          
          // Action buttons
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          
          // Close button positioning - top right inside toast content
          closeButton: "absolute top-3 right-3 !m-0 transform scale-90",
          
          // Success toast - green border
          success: "border-green-500 dark:border-green-400",
          
          // Error toast - red border  
          error: "border-red-500 dark:border-red-400",
          
          // Warning toast - orange border
          warning: "border-orange-500 dark:border-orange-400",
          
          // Info toast - blue border
          info: "border-blue-500 dark:border-blue-400",
          
          // Default and loading toasts
          default: "border-border",
          loading: "border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }