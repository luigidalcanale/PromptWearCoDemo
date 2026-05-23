import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { PrintButton } from "@/components/PrintButton";
import { LastUpdated } from "@/components/LastUpdated";
import ceoData from "@/data/ceoSummary.json";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

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

export default function CEOHomePage() {
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
          </h2>
          <div className="space-y-3">
            {ceoData.priorities.map((p) => (
              <div
                key={p.priority}
                className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                      {p.priority}
                    </span>
                    <div>
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
              </div>
            ))}
          </div>
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
