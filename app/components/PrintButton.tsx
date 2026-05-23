"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print Briefing" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-accent text-foreground transition-colors"
    >
      <Printer size={14} />
      {label}
    </button>
  );
}
