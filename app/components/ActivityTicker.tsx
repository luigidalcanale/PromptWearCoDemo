"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { USERS } from "@/lib/users";

type Tone = "sale" | "info" | "alert" | "system";
type Event = { id: number; text: string; tone: Tone };

const SALE_PRODUCTS = [
  ["Built With AI Hoodie", 58],
  ["Prompt Engineer Tee", 32],
  ["I Love AI Tee", 28],
  ["Hallucination-Free Hat", 26],
  ["Ship It With AI Tote", 24],
  ["RAG Pipeline Crewneck", 64],
] as const;

const TEMPLATES: { build: () => Omit<Event, "id">; weight: number }[] = [
  {
    weight: 5,
    build: () => {
      const [name, price] = SALE_PRODUCTS[Math.floor(Math.random() * SALE_PRODUCTS.length)];
      const order = 4890 + Math.floor(Math.random() * 80);
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      return {
        text: `New order #${order} — ${name} · $${price} (${user.city})`,
        tone: "sale",
      };
    },
  },
  {
    weight: 3,
    build: () => {
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      return { text: `New signup from ${user.city}, ${user.country} — ${user.name}`, tone: "info" };
    },
  },
  {
    weight: 2,
    build: () => {
      const amt = 30 + Math.floor(Math.random() * 220);
      const acme = ["acme.co", "north.studio", "loop.dev", "brightlane.io"][Math.floor(Math.random() * 4)];
      return { text: `Stripe charge $${amt} from ${acme}`, tone: "sale" };
    },
  },
  { weight: 2, build: () => ({ text: "Instagram referral → 12 sessions in last 5 min", tone: "info" }) },
  { weight: 2, build: () => ({ text: "Cart abandoned — recovery email queued ($46)", tone: "info" }) },
  { weight: 1, build: () => ({ text: "Low stock alert — Built With AI Hoodie (8 left)", tone: "alert" }) },
  { weight: 1, build: () => ({ text: "AI drafted reply to support ticket #T-2041", tone: "system" }) },
  { weight: 1, build: () => ({ text: "Ad spend pacing 92% of daily budget", tone: "info" }) },
  { weight: 1, build: () => ({ text: "Shopify checkout error rate dropped to 0.2%", tone: "system" }) },
  {
    weight: 1,
    build: () => {
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      return { text: `${user.name} reviewed Built With AI Hoodie — 5★`, tone: "info" };
    },
  },
];

function pickEvent(): Omit<Event, "id"> {
  const total = TEMPLATES.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of TEMPLATES) {
    if ((r -= t.weight) <= 0) return t.build();
  }
  return TEMPLATES[0].build();
}

const TONE_STYLES: Record<Tone, string> = {
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
      setCurrent({ ...pickEvent(), id: counter++ });
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

/* Re-export the picker so the dashboard feed can share it. */
export { pickEvent };
export type { Event as TickerEvent, Tone as TickerTone };
