"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

export function DemoBanner() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("demoBannerHidden") === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="no-print w-full h-8 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs sm:text-sm flex items-center justify-center px-4 relative">
      <Sparkles size={13} className="mr-2 hidden sm:inline" />
      <span className="font-medium">
        Portfolio demo · all data is simulated · PromptWear Co. is a fictional business
      </span>
      <button
        onClick={() => {
          localStorage.setItem("demoBannerHidden", "1");
          setHidden(true);
        }}
        aria-label="Dismiss banner"
        className="absolute right-3 hover:opacity-75 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}
