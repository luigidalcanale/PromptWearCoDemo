"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "info" | "warning" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster />");
  return ctx;
}

let nextId = 1;

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="no-print fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 4500);
    return () => clearTimeout(id);
  }, [onDismiss]);

  const styles: Record<ToastVariant, { bg: string; icon: ReactNode }> = {
    success: {
      bg: "border-green-200 bg-green-50 text-green-900 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-100",
      icon: <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />,
    },
    info: {
      bg: "border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-100",
      icon: <Info size={18} className="text-blue-600 dark:text-blue-400" />,
    },
    warning: {
      bg: "border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-100",
      icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />,
    },
    error: {
      bg: "border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100",
      icon: <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />,
    },
  };
  const s = styles[toast.variant];

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-toast-in ${s.bg}`}
    >
      <div className="mt-0.5">{s.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="text-xs mt-0.5 opacity-80 leading-snug">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}
