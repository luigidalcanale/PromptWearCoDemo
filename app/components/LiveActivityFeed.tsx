"use client";

import { useEffect, useState } from "react";
import {
  Activity, ShoppingBag, UserPlus, Mail, AlertTriangle, Bot, Megaphone, Star,
  Pin, Archive, Copy, CheckCircle2,
} from "lucide-react";
import { USERS, SeedUser } from "@/lib/users";
import { DetailDrawer } from "./DetailDrawer";
import { ContextMenu, ContextMenuItem } from "./ContextMenu";
import { useToast } from "./Toaster";

type Kind = "order" | "signup" | "cart" | "stock" | "ai" | "ad" | "review" | "payment";
type FeedItem = {
  id: string;
  kind: Kind;
  user: SeedUser;
  title: string;
  detail: string;
  amount?: number;
  ts: number;
};

const PRODUCTS = [
  "Built With AI Hoodie",
  "Prompt Engineer Tee",
  "I Love AI Tee",
  "Hallucination-Free Hat",
  "Ship It With AI Tote",
];

const COMPANIES = ["acme.co", "north.studio", "loop.dev", "brightlane.io", "lumen.ai"];

function makeItem(now = Date.now()): FeedItem {
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  const kinds: Kind[] = ["order", "order", "order", "signup", "cart", "stock", "ai", "ad", "review", "payment"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const amount = 24 + Math.floor(Math.random() * 80);
  const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
  const id = `${now}-${Math.random().toString(36).slice(2, 7)}`;

  switch (kind) {
    case "order":
      return { id, kind, user, ts: now, amount, title: `New order — ${product}`, detail: `${user.name} · ${user.city}, ${user.country}` };
    case "signup":
      return { id, kind, user, ts: now, title: `New signup`, detail: `${user.name} from ${user.city}, ${user.country}` };
    case "cart":
      return { id, kind, user, ts: now, amount, title: `Cart abandoned`, detail: `${user.name} — recovery email queued` };
    case "stock":
      return { id, kind, user, ts: now, title: `Low stock alert`, detail: `${product} — 8 units remaining` };
    case "ai":
      return { id, kind, user, ts: now, title: `AI drafted reply`, detail: `Ticket from ${user.name} — sizing question` };
    case "ad":
      return { id, kind, user, ts: now, title: `Ad campaign update`, detail: `Meta Ads · spend pacing 92% of daily budget` };
    case "review":
      return { id, kind, user, ts: now, title: `New 5★ review`, detail: `${user.name} reviewed ${product}` };
    case "payment":
      return { id, kind, user, ts: now, amount, title: `Stripe charge`, detail: `$${amount} from ${company}` };
  }
}

function relativeTime(ts: number, now: number): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const KIND_META: Record<Kind, { color: string; bg: string; icon: typeof Activity }> = {
  order: { color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40", icon: ShoppingBag },
  signup: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", icon: UserPlus },
  cart: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", icon: Mail },
  stock: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: AlertTriangle },
  ai: { color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40", icon: Bot },
  ad: { color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40", icon: Megaphone },
  review: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40", icon: Star },
  payment: { color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40", icon: ShoppingBag },
};

interface Props {
  initialCount?: number;
  intervalMs?: [number, number];
  maxItems?: number;
}

export function LiveActivityFeed({ initialCount = 6, intervalMs = [10000, 20000], maxItems = 12 }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [now, setNow] = useState(Date.now());
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const [pinned, setPinned] = useState<Set<string>>(new Set());

  useEffect(() => {
    const start = Date.now();
    const seed: FeedItem[] = [];
    for (let i = 0; i < initialCount; i++) {
      seed.push(makeItem(start - (i + 1) * (30_000 + Math.random() * 90_000)));
    }
    setItems(seed);
  }, [initialCount]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const [lo, hi] = intervalMs;
      timer = setTimeout(() => {
        setItems((prev) => [makeItem(), ...prev].slice(0, maxItems));
        schedule();
      }, lo + Math.random() * (hi - lo));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [intervalMs, maxItems]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const archive = (item: FeedItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast({
      variant: "info",
      title: "Archived",
      description: item.title,
      onUndo: () => setItems((prev) => [item, ...prev].slice(0, maxItems)),
    });
  };

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyLink = (item: FeedItem) => {
    const text = `${item.title} — ${item.detail}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    toast({ variant: "success", title: "Copied to clipboard", description: text });
  };

  const markResolved = (item: FeedItem) => {
    toast({ variant: "success", title: "Marked resolved", description: item.title });
  };

  const menuItems = (item: FeedItem): ContextMenuItem[] => [
    { label: pinned.has(item.id) ? "Unpin" : "Pin to top", icon: <Pin size={14} />, onSelect: () => togglePin(item.id) },
    { label: "Copy link", icon: <Copy size={14} />, onSelect: () => copyLink(item), shortcut: "⌘C" },
    { label: "Mark resolved", icon: <CheckCircle2 size={14} />, onSelect: () => markResolved(item) },
    { label: "Archive", icon: <Archive size={14} />, onSelect: () => archive(item), variant: "danger" },
  ];

  const sorted = [...items].sort((a, b) => {
    const ap = pinned.has(a.id) ? 1 : 0;
    const bp = pinned.has(b.id) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return b.ts - a.ts;
  });

  return (
    <>
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Activity size={14} className="text-blue-500" />
            Live Activity
          </h2>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 ping-dot" />
            Streaming
          </span>
        </div>
        <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
          {sorted.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;
            const isPinned = pinned.has(item.id);
            return (
              <ContextMenu key={item.id} items={menuItems(item)}>
                <li
                  className="group flex items-start gap-3 px-5 py-3 hover:bg-muted/40 cursor-pointer transition-colors fade-in"
                  onClick={() => setSelected(item)}
                >
                  <div className="relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full border border-border bg-muted"
                      loading="lazy"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${meta.bg} ${meta.color} flex items-center justify-center border-2 border-card`}>
                      <Icon size={9} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      {item.amount != null && (
                        <span className="text-xs font-semibold text-green-700 dark:text-green-400 tabular-nums">
                          ${item.amount}
                        </span>
                      )}
                      {isPinned && <Pin size={10} className="text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <span className="flex-shrink-0 text-[11px] text-muted-foreground tabular-nums">
                    {relativeTime(item.ts, now)}
                  </span>
                </li>
              </ContextMenu>
            );
          })}
        </ul>
      </div>

      <DetailDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        subtitle={selected ? relativeTime(selected.ts, now) : ""}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.user.avatar} alt="" className="w-10 h-10 rounded-full border border-border bg-card" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{selected.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selected.user.email} · {selected.user.city}, {selected.user.country}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Detail</h3>
              <p className="text-sm">{selected.detail}</p>
              {selected.amount != null && (
                <p className="text-sm mt-2">
                  Amount: <span className="font-semibold text-foreground tabular-nums">${selected.amount}</span>
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Timeline</h3>
              <ol className="relative border-l border-border ml-2 space-y-3 pl-4">
                {[
                  { t: "now", l: "Event recorded" },
                  { t: "12s ago", l: "Webhook received from Shopify" },
                  { t: "31s ago", l: "Customer initiated checkout" },
                  { t: "4m ago", l: "Customer visited product page" },
                ].map((row, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-xs font-medium text-foreground">{row.l}</p>
                    <p className="text-[11px] text-muted-foreground">{row.t}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Related</h3>
              <ul className="space-y-1.5">
                <li className="text-sm flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <span>Customer LTV</span>
                  <span className="font-semibold tabular-nums">${(2 + Math.floor(Math.random() * 8)) * 100}</span>
                </li>
                <li className="text-sm flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <span>Orders this year</span>
                  <span className="font-semibold tabular-nums">{1 + Math.floor(Math.random() * 6)}</span>
                </li>
                <li className="text-sm flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <span>Acquisition source</span>
                  <span className="font-semibold">Instagram</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => {
                  if (selected) archive(selected);
                  setSelected(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted/50 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => selected && markResolved(selected)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Mark resolved
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
