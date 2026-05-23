import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import ceoData from "@/data/ceoSummary.json";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const urgencyVariant = (u: string) =>
  u === "high" ? "risk" : u === "medium" ? "warning" : "info";

const statusVariant = (s: string): "healthy" | "warning" | "risk" | "neutral" =>
  s === "healthy" ? "healthy" : s === "warning" ? "warning" : s === "risk" ? "risk" : "neutral";

export default function CEOHomePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="CEO Home Dashboard"
        subtitle={`${ceoData.businessName} · ${ceoData.snapshot}`}
        badge="Live Snapshot"
      />

      <AIInsightBox title="AI Business Summary — Today" className="mb-6">
        {ceoData.summary}
      </AIInsightBox>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {ceoData.metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            status={statusVariant(m.status)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            AI-Recommended CEO Priorities
          </h2>
          <div className="space-y-3">
            {ceoData.priorities.map((p) => (
              <div
                key={p.priority}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5">
                      {p.priority}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.issue}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.reason}</p>
                      <p className="text-xs font-medium text-blue-700 mt-1.5">→ {p.action}</p>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Active Risk Alerts
          </h2>
          <div className="space-y-2 mb-6">
            {ceoData.risks.map((r) => (
              <div
                key={r.label}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 border text-sm font-medium ${
                  r.level === "high"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <AlertTriangle size={14} />
                {r.label}
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Today at a Glance
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Gross Sales", "$3,490", "healthy"],
                  ["Orders", "92", "healthy"],
                  ["Conversion Rate", "1.9%", "warning"],
                  ["Low Stock SKUs", "2", "risk"],
                  ["Open Tickets", "14", "warning"],
                  ["Ad Spend", "$620", "healthy"],
                ].map(([label, value, status], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2.5 text-gray-600">{label}</td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900 text-right">{value}</td>
                    <td className="px-4 py-2.5 text-right">
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

      <p className="text-xs text-gray-400 mt-8 text-center">
        All data is simulated for portfolio demonstration purposes. PromptWear Co. is a fictional business.
      </p>
    </div>
  );
}
