import { toast } from "sonner";

type ToastDescription = string | null | undefined;

type PromiseMessages = {
  loading?: string;
  success?: string;
  error?: string;
};

export const showToast = {
  success: (message: string, description: ToastDescription = null) => {
    return toast.success(message, {
      description,
      duration: 3000,
      style: {
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        color: "#ffffff",
      },
    });
  },

  error: (message: string, description: ToastDescription = null) => {
    return toast.error(message, {
      description,
      duration: 4000,
      style: {
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        color: "#ffffff",
      },
    });
  },

  warning: (message: string, description: ToastDescription = null) => {
    return toast.warning(message, {
      description,
      duration: 3000,
      style: {
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid rgba(234, 179, 8, 0.3)",
        color: "#ffffff",
      },
    });
  },

  info: (message: string, description: ToastDescription = null) => {
    return toast.info(message, {
      description,
      duration: 3000,
      style: {
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        color: "#ffffff",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      style: {
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        color: "#ffffff",
      },
    });
  },

  promise: <T,>(promise: Promise<T>, messages: PromiseMessages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Processing...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
    });
  },
};

export default showToast;
