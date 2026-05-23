"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, X } from "lucide-react";

export function RecruiterMode() {
  const params = useSearchParams();
  const [active, setActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setActive(params.get("recruiter") === "true");
  }, [params]);

  if (!active || dismissed) return null;

  return (
    <div className="no-print sticky top-0 z-30 mx-4 mt-4 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/40 dark:to-blue-950/40 dark:border-violet-900/60 p-4 fade-in">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-violet-600 dark:text-violet-300 hover:opacity-70"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center flex-shrink-0">
          <Eye size={16} />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-violet-900 dark:text-violet-100">
            Recruiter Mode is on
          </p>
          <p className="text-violet-800 dark:text-violet-200 mt-1 leading-relaxed">
            You&apos;re viewing this dashboard with annotations enabled. Each
            page shows a different AI-supported business workflow. Highlights
            to look for:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-violet-800 dark:text-violet-200">
            <li>
              <strong>CEO Home</strong> — AI-ranked daily priorities and risks
            </li>
            <li>
              <strong>Email Command Center</strong> — urgency filter +
              AI-drafted replies
            </li>
            <li>
              <strong>Forecasting</strong> — explained predictions tied to
              inventory risk
            </li>
            <li>
              <strong>Decision Log</strong> — AI suggests, humans decide,
              outcomes tracked
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
