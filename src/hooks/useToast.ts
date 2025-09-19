import { toast } from "sonner";

export const useToast = () => {
  return {
    toast,
    // Optional: You can create custom methods for consistency
    success: (message: string, description?: string) => {
      toast.success(message, { description });
    },
    error: (message: string, description?: string) => {
      toast.error(message, { description });
    },
    warning: (message: string, description?: string) => {
      toast.warning(message, { description });
    },
    info: (message: string, description?: string) => {
      toast.info(message, { description });
    },
    loading: (message: string, description?: string) => {
      toast.loading(message, { description });
    },
  };
};