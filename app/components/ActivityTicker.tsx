"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

type Event = { id: number; text: string; tone: "sale" | "info" | "alert" | "system" };

const POOL: Omit<Event, "id">[] = [
  { text: "New order #4892 — Built With AI Hoodie · $58", tone: "sale" },
  { text: "New order #4893 — Prompt Engineer Tee · $32", tone: "sale" },
  { text: "Instagram referral → 12 sessions in the last 5 min", tone: "info" },
  { text: "Cart abandoned — recovery email queued ($46)", tone: "info" },
  { text: "Low stock alert — Built With AI Hoodie (8 left)", tone: "alert" },
  { text: "New order #4894 — I Love AI Tee · $28", tone: "sale" },
  { text: "AI drafted reply to Maya Johnson (sizing issue)", tone: "system" },
  { text: "Customer reviewed Built With AI Hoodie — 5★", tone: "info" },
  { text: "Ad spend pacing 92% of daily budget", tone: "info" },
  { text: "New order #4895 — Hallucination-Free Hat · $26", tone: "sale" },
  { text: "Refund processed — Ship It With AI Tote · $24", tone: "alert" },
  { text: "Returning customer Jordan Lee placed order #4896", tone: "sale" },
  { text: "Shopify checkout error rate dropped to 0.2%", tone: "system" },
  { text: "New TikTok mention — 1.4k views (organic)", tone: "info" },
  { text: "New order #4897 — Prompt Engineer Tee · $32", tone: "sale" },
];

const TONE_STYLES: Record<Event["tone"], string> = {
  sale: "text-green-700 dark:text-green-300",
  info: "text-blue-700 dark:text-blue-300",
  alert: "text-amber-700 dark:text-amber-300",
  system: "text-muted-foreground",
};

let counter = 1;

export function ActivityTicker() {
  const [current, setCurrent] = useState<Event | null>(null);

  useEffect(() => {
    const tick = () => {
      const pick = POOL[Math.floor(Math.random() * POOL.length)];
      setCurrent({ ...pick, id: counter++ });
    };
    tick();
    const id = setInterval(tick, 4200 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 min-w-0 flex-1 max-w-md">
      <span className="relative flex-shrink-0">
        <span className="block w-2 h-2 rounded-full bg-green-500 ping-dot" />
      </span>
      <Activity size={12} className="text-muted-foreground flex-shrink-0" />
      <div className="text-xs min-w-0 truncate">
        {current ? (
          <span key={current.id} className={`fade-in ${TONE_STYLES[current.tone]}`}>
            {current.text}
          </span>
        ) : (
          <span className="text-muted-foreground">Live activity…</span>
        )}
      </div>
    </div>
  );
}
