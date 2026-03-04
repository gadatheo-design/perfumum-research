// @ts-nocheck
import { useState, useCallback } from "react";

export interface Toast {
  id?: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({ title, description, variant = "default", duration = 3000 }: Toast) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = { id, title, description, variant, duration };

    setState((prev) => ({
      toasts: [...prev.toasts, newToast],
    }));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setState((prev) => ({
          toasts: prev.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId),
    }));
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
}
