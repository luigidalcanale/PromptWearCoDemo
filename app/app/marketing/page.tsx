"use client";

import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge, riskToVariant } from "@/components/StatusBadge";
import mktData from "@/data/marketing.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle } from "lucide-react";

export default function MarketingPage() {
  const roasData = mktData.campaigns
    .filter((c) => c.roas !== null)
    .map((c) => ({ name: c.name.split(" ").slice(0, 3).join(" "), roas: c.roas }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Marketing Dashboard"
        subtitle="Campaign performance, A/B tests, customer segments, and AI content ideas"
        badge="4 Campaigns"
      />

      {/* Campaign table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Active Campaigns</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-left">Campaign</th>
              <th className="px-4 py-3 text-left">Channel</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">ROAS</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {mktData.campaigns.map((c, i) => (
              <tr key={c.name} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.channel}</td>
                <td className="px-4 py-3 text-right text-foreground">{c.spend === 0 ? "$0" : `$${c.spend}`}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">${c.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {c.roas !== null ? (
                    <span className={c.roas >= 3 ? "text-green-700" : c.roas >= 2 ? "text-amber-700" : "text-red-700"}>
                      {c.roas}x
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge label={c.status} variant={riskToVariant(c.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ROAS chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">ROAS by Campaign</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={roasData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 5]} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v) => [`${Number(v)}x`, "ROAS"]} />
              <Bar dataKey="roas" radius={[0, 4, 4, 0]}
                fill="#3b82f6"
                label={{ position: "right", fontSize: 11, formatter: (v: unknown) => `${v}x` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* A/B tests */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">A/B Test Results</h2>
          <div className="space-y-3">
            {mktData.abTests.map((t) => (
              <div key={t.test} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">{t.test}</p>
                  <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                    <CheckCircle size={11} />
                    {t.winner}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">A: {t.versionA}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">B: {t.versionB} âœ“</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer segments */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Customer Segments</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 text-left">Segment</th>
                <th className="px-4 py-3 text-left">Behavior</th>
                <th className="px-4 py-3 text-left">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {mktData.segments.map((s, i) => (
                <tr key={s.segment} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.segment}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{s.behavior}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">{s.opportunity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Content ideas */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3">AI-Generated Content Ideas</h2>
          <ul className="space-y-2">
            {mktData.contentIdeas.map((idea, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>&ldquo;{idea}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested actions */}
      <AIInsightBox title="AI-Suggested Marketing Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mktData.suggestedActions.map((a, i) => (
            <div key={i} className="bg-card rounded-lg p-3 border border-blue-100">
              <p className="text-sm font-semibold text-foreground">→ {a.action}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.reason}</p>
            </div>
          ))}
        </div>
      </AIInsightBox>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
