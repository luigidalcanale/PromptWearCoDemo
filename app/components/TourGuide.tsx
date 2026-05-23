"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, X, Sparkles } from "lucide-react";

export type TourStep = {
  selector: string;
  title: string;
  body: string;
  placement?: "bottom" | "top" | "right" | "left";
};

interface Props {
  steps: TourStep[];
  storageKey?: string;
  /** Force the tour open regardless of localStorage. */
  forceOpen?: boolean;
  onClose?: () => void;
}

export function TourGuide({ steps, storageKey = "tour:default", forceOpen = false, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setStepIdx(0);
      return;
    }
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(storageKey)) {
      // Defer until layout settles
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, [forceOpen, storageKey]);

  const step = steps[stepIdx];

  useLayoutEffect(() => {
    if (!open || !step) return;
    const measure = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      // Wait a frame for scroll
      requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step]);

  const finish = () => {
    localStorage.setItem(storageKey, "1");
    setOpen(false);
    onClose?.();
  };

  if (!open || !step) return null;

  const placement = step.placement ?? "bottom";
  const padding = 8;
  let cardStyle: React.CSSProperties = { top: 80, left: 80 };

  if (rect) {
    if (placement === "bottom") {
      cardStyle = { top: rect.bottom + padding, left: Math.max(16, Math.min(rect.left, window.innerWidth - 360)) };
    } else if (placement === "top") {
      cardStyle = { top: Math.max(16, rect.top - 180), left: Math.max(16, Math.min(rect.left, window.innerWidth - 360)) };
    } else if (placement === "right") {
      cardStyle = { top: Math.max(16, rect.top), left: Math.min(window.innerWidth - 360, rect.right + padding) };
    } else {
      cardStyle = { top: Math.max(16, rect.top), left: Math.max(16, rect.left - 340) };
    }
  }

  const cutoutStyle: React.CSSProperties | undefined = rect
    ? {
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }
    : undefined;

  return (
    <div className="no-print fixed inset-0 z-[80] pointer-events-none">
      {/* Dim overlay with cut-out */}
      <div className="absolute inset-0 bg-black/55 pointer-events-auto" onClick={finish} />
      {cutoutStyle && (
        <div
          className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            ...cutoutStyle,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
            outline: "2px solid rgba(59,130,246,0.85)",
            outlineOffset: 0,
          }}
        />
      )}
      {/* Card */}
      <div
        className="absolute pointer-events-auto w-[340px] bg-card text-card-foreground border border-border rounded-xl shadow-2xl p-5 fade-in"
        style={cardStyle}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center">
              <Sparkles size={12} />
            </span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Tour · {stepIdx + 1} / {steps.length}
            </span>
          </div>
          <button onClick={finish} aria-label="Close tour" className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1.5">{step.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  i === stepIdx ? "bg-blue-500" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={finish}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
                else finish();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              {stepIdx < steps.length - 1 ? "Next" : "Finish"}
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
