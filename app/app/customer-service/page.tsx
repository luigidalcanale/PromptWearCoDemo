"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge } from "@/components/StatusBadge";
import csData from "@/data/serviceTickets.json";
import { Bot, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";

const urgencyVariant = (u: string): "risk" | "warning" | "info" | "neutral" =>
  u === "high" ? "risk" : u === "medium" ? "warning" : u === "low" ? "info" : "neutral";

export default function CustomerServicePage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDraft, setShowDraft] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Customer Service Center"
        subtitle="AI clusters complaints, drafts responses, and recommends process improvements"
        badge="14 Open Tickets"
      />

      {/* CSAT metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard label="CSAT Score" value="4.3 / 5" status="healthy" />
        <MetricCard label="Avg Response" value="3.2 hrs" status="warning" />
        <MetricCard label="Open Tickets" value="14" status="warning" />
        <MetricCard label="Resolved Today" value="9" status="healthy" />
        <MetricCard label="Refund Rate" value="4.3%" status="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Issue summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Issues Today — by Type</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Issue Type</th>
                <th className="px-4 py-3 text-right">Count</th>
                <th className="px-4 py-3 text-left">Theme</th>
              </tr>
            </thead>
            <tbody>
              {csData.issueSummary.map((s, i) => (
                <tr key={s.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{s.count}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Service improvements */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500" />
            AI-Suggested Service Improvements
          </h2>
          <ul className="space-y-2.5">
            {csData.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ticket cards */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Open Tickets with AI Draft Responses</h2>
      <div className="space-y-3">
        {csData.tickets.map((ticket) => {
          const isExpanded = expanded === ticket.id;
          const isDraftShown = showDraft === ticket.id;

          return (
            <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                className="w-full px-4 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : ticket.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                    <span className="text-sm font-semibold text-gray-900">{ticket.customer}</span>
                    <StatusBadge
                      label={ticket.urgency.charAt(0).toUpperCase() + ticket.urgency.slice(1)}
                      variant={urgencyVariant(ticket.urgency)}
                    />
                    <StatusBadge label={ticket.type} variant="neutral" />
                    <span className="ml-auto text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{ticket.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ticket.issue}</p>
                </div>
                <span className="flex-shrink-0 text-gray-400 mt-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500">Suggested Resolution: <span className="text-gray-800">{ticket.resolution}</span></p>
                    <button
                      onClick={() => setShowDraft(isDraftShown ? null : ticket.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Bot size={12} />
                      {isDraftShown ? "Hide Draft" : "AI Draft Reply"}
                    </button>
                  </div>

                  {isDraftShown && (
                    <AIInsightBox title="AI Draft Response">
                      <p className="italic">&ldquo;{ticket.draft}&rdquo;</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Review and personalize before sending.</p>
                    </AIInsightBox>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
