"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Bot } from "lucide-react";

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("onboardingSeen");
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem("onboardingSeen", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
      <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <h2 className="text-lg font-semibold">Welcome to the Command Center</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          This is a portfolio demo of an AI-powered operating system for a
          small online apparel company. Every page shows a different way AI can
          support real business workflows.
        </p>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground mb-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <Bot size={12} className="text-blue-500" />
            <span>Use the sidebar to explore 12 pages</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">⌘K</kbd>
            <span>or <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">Ctrl K</kbd> to jump anywhere</span>
          </div>
        </div>

        <button
          onClick={close}
          className="w-full px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Got it — let&apos;s explore
        </button>
      </div>
    </div>
  );
}
