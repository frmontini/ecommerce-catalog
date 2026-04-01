import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const value = useMemo<ToastContextValue>(
    () => ({
      toast: ({ title, description, variant = "info" }) => {
        if (variant === "success") {
          sonnerToast.success(title, { description });
          return;
        }

        if (variant === "error") {
          sonnerToast.error(title, { description });
          return;
        }

        sonnerToast(title, { description });
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        closeButton
        expand={false}
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          className: "!border !border-white/10 !bg-slate-950/95 !text-slate-100 !shadow-2xl !shadow-black/30",
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
