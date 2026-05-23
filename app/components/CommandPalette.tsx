"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

const commands = [
  { label: "CEO Home", href: "/", keywords: "dashboard summary priorities" },
  { label: "AI Email Command Center", href: "/email-command-center", keywords: "emails inbox urgency draft" },
  { label: "Sales Dashboard", href: "/sales", keywords: "revenue orders products" },
  { label: "Sales Forecasting", href: "/forecasting", keywords: "demand 7-day predict" },
  { label: "Inventory & Suppliers", href: "/inventory", keywords: "stock reorder supplier scorecard" },
  { label: "Marketing", href: "/marketing", keywords: "campaigns ads roas content" },
  { label: "Customer Service", href: "/customer-service", keywords: "tickets csat support" },
  { label: "Meeting Notes", href: "/meetings", keywords: "transcript summary translation spanish" },
  { label: "Finance", href: "/finance", keywords: "p&l profit cash runway warnings" },
  { label: "AI Automation Map", href: "/automation-map", keywords: "workflows time saved" },
  { label: "Decision Log", href: "/decision-log", keywords: "decisions ai recommendation human" },
  { label: "Portfolio Case Study", href: "/case-study", keywords: "about overview tech stack" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.keywords.toLowerCase().includes(q)
      )
    : commands;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) {
        router.push(item.href);
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-card text-card-foreground rounded-xl shadow-2xl max-w-lg w-full border border-border overflow-hidden fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={handleKey}
            placeholder="Jump to a page…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No matches for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((c, i) => (
              <button
                key={c.href}
                onClick={() => {
                  router.push(c.href);
                  setOpen(false);
                }}
                onMouseEnter={() => setActive(i)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left ${
                  i === active ? "bg-accent" : ""
                }`}
              >
                <span>{c.label}</span>
                {i === active && <ArrowRight size={14} className="text-muted-foreground" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
