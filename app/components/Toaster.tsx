"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Undo2 } from "lucide-react";

export type ToastVariant = "success" | "info" | "warning" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  /** Show an undo button. onUndo fires if clicked before the toast dismisses. */
  onUndo?: () => void;
  undoLabel?: string;
  /** ms before auto-dismiss. Default 4500. Toasts with onUndo default to 5000. */
  durationMs?: number;
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
  const duration = toast.durationMs ?? (toast.onUndo ? 5000 : 4500);
  const startRef = useRef(Date.now());
  const [progress, setProgress] = useState(100);
  const undoneRef = useRef(false);

  useEffect(() => {
    const id = setTimeout(onDismiss, duration);
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      if (elapsed < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [duration, onDismiss]);

  const styles: Record<ToastVariant, { bg: string; bar: string; icon: ReactNode }> = {
    success: {
      bg: "border-green-200 bg-green-50 text-green-900 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-100",
      bar: "bg-green-500/70",
      icon: <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />,
    },
    info: {
      bg: "border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-100",
      bar: "bg-blue-500/70",
      icon: <Info size={18} className="text-blue-600 dark:text-blue-400" />,
    },
    warning: {
      bg: "border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-100",
      bar: "bg-amber-500/70",
      icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />,
    },
    error: {
      bg: "border-red-200 bg-red-50 text-red-900 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-100",
      bar: "bg-red-500/70",
      icon: <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />,
    },
  };
  const s = styles[toast.variant];

  const handleUndo = () => {
    if (undoneRef.current) return;
    undoneRef.current = true;
    toast.onUndo?.();
    onDismiss();
  };

  return (
    <div
      role="status"
      className={`relative pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-toast-in overflow-hidden ${s.bg}`}
    >
      <div className="mt-0.5">{s.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="text-xs mt-0.5 opacity-80 leading-snug">{toast.description}</p>
        )}
      </div>
      {toast.onUndo && (
        <button
          onClick={handleUndo}
          className="inline-flex items-center gap-1 px-2 py-1 -my-0.5 rounded-md bg-background/60 hover:bg-background text-xs font-semibold transition-colors"
        >
          <Undo2 size={11} />
          {toast.undoLabel ?? "Undo"}
        </button>
      )}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
      <span
        className={`absolute bottom-0 left-0 h-0.5 ${s.bar} transition-[width] duration-100 ease-linear`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
