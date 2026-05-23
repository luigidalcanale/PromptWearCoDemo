"use client";

import { useEffect, useRef, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PrintButton } from "@/components/PrintButton";
import { LastUpdated } from "@/components/LastUpdated";
import { LiveStatusDot } from "@/components/LiveStatusDot";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { EmptyState } from "@/components/EmptyState";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useLiveValue } from "@/lib/useLiveValue";
import { useToast } from "@/components/Toaster";
import ceoData from "@/data/ceoSummary.json";
import { AlertTriangle, CheckCircle, TrendingUp, Check, X, GripVertical, PartyPopper } from "lucide-react";

const urgencyVariant = (u: string) =>
  u === "high" ? "risk" : u === "medium" ? "warning" : "info";

const statusVariant = (s: string): "healthy" | "warning" | "risk" | "neutral" =>
  s === "healthy" ? "healthy" : s === "warning" ? "warning" : s === "risk" ? "risk" : "neutral";

const trendDirection = (trend: string): "up" | "down" | "flat" | undefined => {
  if (!trend) return undefined;
  const t = trend.toLowerCase();
  if (t.includes("+") || t.includes("up") || t.includes("strong") || t.includes("healthy")) return "up";
  if (t.includes("-") || t.includes("down") || t.includes("below") || t.includes("elevated") || t.includes("needs action") || t.includes("watch")) return "down";
  if (t.includes("stable") || t.includes("within budget") || t.includes("moderate")) return "flat";
  return undefined;
};

type Decision = "approved" | "rejected";

// Parse "$3,490" / "1.9%" / "92" — try to pull out a numeric value & a formatter.
function parseMetric(value: string): { numeric: number; format: (n: number) => string } | null {
  const isMoney = value.startsWith("$");
  const isPct = value.endsWith("%");
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  if (isMoney) return { numeric: n, format: (v) => `$${Math.round(v).toLocaleString()}` };
  if (isPct) return { numeric: n, format: (v) => `${v.toFixed(1)}%` };
  return { numeric: n, format: (v) => Math.round(v).toLocaleString() };
}

export default function CEOHomePage() {
  const { toast } = useToast();
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});

  // Drag-to-reorder (HTML5 DnD, no extra deps; persisted to localStorage)
  const initialOrder = ceoData.priorities.map((p) => p.priority);
  const [order, setOrder] = useState<number[]>(initialOrder);
  const dragId = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ceo:priority-order");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        const valid = parsed.filter((id) => initialOrder.includes(id));
        const missing = initialOrder.filter((id) => !valid.includes(id));
        setOrder([...valid, ...missing]);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ceo:priority-order", JSON.stringify(order));
  }, [order]);

  const onDragStart = (id: number) => () => {
    dragId.current = id;
  };
  const onDragOver = (id: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragId.current;
    if (from == null || from === id) return;
    setOrder((cur) => {
      const next = [...cur];
      const fi = next.indexOf(from);
      const ti = next.indexOf(id);
      if (fi === -1 || ti === -1) return next;
      next.splice(fi, 1);
      next.splice(ti, 0, from);
      return next;
    });
  };
  const onDragEnd = () => {
    dragId.current = null;
  };

  const decide = (priority: number, issue: string, action: string, choice: Decision) => {
    setDecisions((d) => ({ ...d, [priority]: choice }));
    const undo = () => setDecisions((d) => {
      const next = { ...d };
      delete next[priority];
      return next;
    });
    if (choice === "approved") {
      toast({
        variant: "success",
        title: `Approved — ${issue}`,
        description: `${action}. Logged to Decision Log.`,
        onUndo: undo,
      });
    } else {
      toast({
        variant: "warning",
        title: `Dismissed — ${issue}`,
        description: `Recommendation set aside for now.`,
        onUndo: undo,
      });
    }
  };

  const byId = new Map(ceoData.priorities.map((p) => [p.priority, p]));
  const ordered = order.map((id) => byId.get(id)!).filter(Boolean);
  const open = ordered.filter((p) => !decisions[p.priority]);
  const completed = ordered.filter((p) => decisions[p.priority]);

  // Live values for the "Today at a Glance" table — these breathe ±~0.5%.
  const liveGross = useLiveValue(3490, { drift: 0.004 });
  const liveOrders = useLiveValue(92, { drift: 0.005 });
  const liveConv = useLiveValue(1.9, { drift: 0.006 });
  const liveAdSpend = useLiveValue(620, { drift: 0.004 });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="CEO Home Dashboard"
        subtitle={`${ceoData.businessName} · ${ceoData.snapshot}`}
        badge="Live Snapshot"
        actions={
          <div className="flex items-center gap-3">
            <LiveStatusDot label="" />
            <LastUpdated minutesAgo={3} />
            <PrintButton />
          </div>
        }
      />

      <AIInsightBox title="AI Business Summary — Today" className="mb-8">
        {ceoData.summary}
      </AIInsightBox>

      <div data-tour="metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {ceoData.metrics.map((m, idx) => {
          const parsed = parseMetric(m.value);
          const isHero = idx === 0 && parsed; // give the first card an editable target
          return (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              numeric={parsed?.numeric}
              format={parsed?.format}
              trend={m.trend}
              status={statusVariant(m.status)}
              direction={trendDirection(m.trend)}
              target={
                isHero
                  ? { initial: Math.round(parsed!.numeric * 1.1), storageKey: `ceo:${m.label}`, format: parsed!.format }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div data-tour="priorities">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            AI-Recommended CEO Priorities
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({open.length} open)
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 ml-auto hidden sm:inline">
              Drag to reorder
            </span>
          </h2>
          <div className="space-y-3">
            {open.length === 0 && (
              <EmptyState
                icon={<PartyPopper size={22} />}
                title="All recommendations handled"
                description="Nothing else needs your attention right now. New AI suggestions will appear here as the business state changes."
              />
            )}
            {open.map((p) => (
              <div
                key={p.priority}
                draggable
                onDragStart={onDragStart(p.priority)}
                onDragOver={onDragOver(p.priority)}
                onDragEnd={onDragEnd}
                className="group bg-card text-card-foreground rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow fade-in cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <GripVertical
                      size={14}
                      className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1.5 flex-shrink-0"
                    />
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                      {p.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{p.issue}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.reason}</p>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-2">→ {p.action}</p>
                    </div>
                  </div>
                  <StatusBadge
                    label={p.urgency.charAt(0).toUpperCase() + p.urgency.slice(1)}
                    variant={urgencyVariant(p.urgency) as "risk" | "warning" | "info"}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => decide(p.priority, p.issue, p.action, "approved")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    onClick={() => decide(p.priority, p.issue, p.action, "rejected")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-colors"
                  >
                    <X size={13} /> Dismiss
                  </button>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    AI confidence: {p.urgency === "high" ? "92%" : "84%"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {completed.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-green-500" />
                Completed Today ({completed.length})
              </h3>
              <div className="space-y-2">
                {completed.map((p) => {
                  const d = decisions[p.priority];
                  return (
                    <div
                      key={p.priority}
                      className="bg-muted/40 border border-border rounded-lg px-4 py-2.5 flex items-center gap-3 fade-in"
                    >
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          d === "approved" ? "bg-green-500 text-white" : "bg-muted-foreground/30 text-foreground"
                        }`}
                      >
                        {d === "approved" ? <Check size={12} /> : <X size={12} />}
                      </span>
                      <p className="text-sm text-foreground flex-1 line-through opacity-70">{p.issue}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {d === "approved" ? "Approved" : "Dismissed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div data-tour="risks" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Active Risk Alerts
            </h2>
            <div className="space-y-2">
              {ceoData.risks.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 border text-sm font-medium ${
                    r.level === "high"
                      ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/60 dark:text-red-200"
                      : "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200"
                  }`}
                >
                  <AlertTriangle size={14} />
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Today at a Glance
            </h2>
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Gross Sales", live: liveGross, fmt: (n: number) => `$${Math.round(n).toLocaleString()}`, status: "healthy" },
                    { label: "Orders", live: liveOrders, fmt: (n: number) => `${Math.round(n)}`, status: "healthy" },
                    { label: "Conversion Rate", live: liveConv, fmt: (n: number) => `${n.toFixed(1)}%`, status: "warning" },
                    { label: "Low Stock SKUs", live: 2, fmt: (n: number) => `${Math.round(n)}`, status: "risk" },
                    { label: "Open Tickets", live: 14, fmt: (n: number) => `${Math.round(n)}`, status: "warning" },
                    { label: "Ad Spend", live: liveAdSpend, fmt: (n: number) => `$${Math.round(n)}`, status: "healthy" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-3 text-muted-foreground">{row.label}</td>
                      <td className="px-5 py-3 font-semibold text-foreground text-right">
                        <AnimatedNumber value={row.live} format={row.fmt} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <StatusBadge
                          label={row.status === "healthy" ? "Good" : row.status === "warning" ? "Watch" : "Action"}
                          variant={row.status as "healthy" | "warning" | "risk"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <LiveActivityFeed />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-10 text-center">
        All data is simulated for portfolio demonstration purposes. PromptWear Co. is a fictional business.
      </p>
    </div>
  );
}
