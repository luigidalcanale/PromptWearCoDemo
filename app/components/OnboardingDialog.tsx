"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Bot, MousePointerClick } from "lucide-react";
import { TourGuide, TourStep } from "./TourGuide";

const HOME_TOUR: TourStep[] = [
  {
    selector: '[data-tour="metrics"]',
    title: "Live KPIs",
    body: "Numbers count up on load and pulse green/red as the underlying data drifts. The first card has an editable goal — click the target to change it.",
    placement: "bottom",
  },
  {
    selector: '[data-tour="priorities"]',
    title: "AI-Recommended Priorities",
    body: "Approve or dismiss each item — you can undo from the toast. Cards are drag-to-reorder, and the order is saved per browser.",
    placement: "right",
  },
  {
    selector: '[data-tour="risks"]',
    title: "Risks + Today at a Glance",
    body: "The 'Today at a Glance' numbers breathe every few seconds to simulate live telemetry. Watch them for a moment.",
    placement: "left",
  },
];

export function OnboardingDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

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

  const startTour = () => {
    localStorage.setItem("onboardingSeen", "1");
    setOpen(false);
    // Only run the tour if we're on the home page (where the targets exist)
    if (pathname === "/") {
      setTourOpen(true);
    } else {
      // Persist a flag so we open the tour after navigating
      sessionStorage.setItem("tour:pending", "1");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (pathname === "/" && sessionStorage.getItem("tour:pending")) {
      sessionStorage.removeItem("tour:pending");
      const t = setTimeout(() => setTourOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <>
      {open && (
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
              <div className="flex items-center gap-2">
                <MousePointerClick size={12} className="text-blue-500" />
                <span>Right-click activity items for quick actions</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startTour}
                className="flex-1 px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} />
                Take the 30-second tour
              </button>
              <button
                onClick={close}
                className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {tourOpen && (
        <TourGuide
          steps={HOME_TOUR}
          storageKey="tour:home"
          forceOpen
          onClose={() => setTourOpen(false)}
        />
      )}
    </>
  );
}
