"use client";

import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PrintButton } from "@/components/PrintButton";
import { LastUpdated } from "@/components/LastUpdated";
import { useToast } from "@/components/Toaster";
import ceoData from "@/data/ceoSummary.json";
import { AlertTriangle, CheckCircle, TrendingUp, Check, X } from "lucide-react";

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

export default function CEOHomePage() {
  const { toast } = useToast();
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});

  const decide = (priority: number, issue: string, action: string, choice: Decision) => {
    setDecisions((d) => ({ ...d, [priority]: choice }));
    if (choice === "approved") {
      toast({
        variant: "success",
        title: `Approved — ${issue}`,
        description: `${action}. Logged to Decision Log.`,
      });
    } else {
      toast({
        variant: "warning",
        title: `Dismissed — ${issue}`,
        description: `Recommendation set aside for now.`,
      });
    }
  };

  const open = ceoData.priorities.filter((p) => !decisions[p.priority]);
  const completed = ceoData.priorities.filter((p) => decisions[p.priority]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="CEO Home Dashboard"
        subtitle={`${ceoData.businessName} · ${ceoData.snapshot}`}
        badge="Live Snapshot"
        actions={
          <>
            <LastUpdated minutesAgo={3} />
            <PrintButton />
          </>
        }
      />

      <AIInsightBox title="AI Business Summary — Today" className="mb-8">
        {ceoData.summary}
      </AIInsightBox>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {ceoData.metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            status={statusVariant(m.status)}
            direction={trendDirection(m.trend)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            AI-Recommended CEO Priorities
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({open.length} open)
            </span>
          </h2>
          <div className="space-y-3">
            {open.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground text-center">
                All AI recommendations handled. Great work.
              </div>
            )}
            {open.map((p) => (
              <div
                key={p.priority}
                className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow fade-in"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
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

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Active Risk Alerts
          </h2>
          <div className="space-y-2 mb-8">
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

          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Today at a Glance
          </h2>
          <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Gross Sales", "$3,490", "healthy"],
                  ["Orders", "92", "healthy"],
                  ["Conversion Rate", "1.9%", "warning"],
                  ["Low Stock SKUs", "2", "risk"],
                  ["Open Tickets", "14", "warning"],
                  ["Ad Spend", "$620", "healthy"],
                ].map(([label, value, status]) => (
                  <tr key={label} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 text-muted-foreground">{label}</td>
                    <td className="px-5 py-3 font-semibold text-foreground text-right tabular-nums">{value}</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge
                        label={status === "healthy" ? "Good" : status === "warning" ? "Watch" : "Action"}
                        variant={status as "healthy" | "warning" | "risk"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-10 text-center">
        All data is simulated for portfolio demonstration purposes. PromptWear Co. is a fictional business.
      </p>
    </div>
  );
}
