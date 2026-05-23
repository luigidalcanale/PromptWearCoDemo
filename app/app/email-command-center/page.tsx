"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge } from "@/components/StatusBadge";
import emails from "@/data/emails.json";
import { ChevronDown, ChevronRight, Bot, AlertTriangle } from "lucide-react";

type UrgencyFilter = "all" | "high" | "medium" | "low";

const urgencyVariant = (u: string): "risk" | "warning" | "info" | "neutral" => {
  if (u === "high") return "risk";
  if (u === "medium") return "warning";
  if (u === "low") return "info";
  return "neutral";
};

export default function EmailCommandCenterPage() {
  const [filter, setFilter] = useState<UrgencyFilter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showDraft, setShowDraft] = useState<number | null>(null);

  const filtered = emails.filter((e) => filter === "all" || e.urgency === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="AI Email Command Center"
        subtitle="AI summarizes emails, flags urgency, estimates business impact, and drafts replies."
        badge="6 emails today"
      />

      {/* Urgency filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "high", "medium", "low"] as UrgencyFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "All Emails" : f.charAt(0).toUpperCase() + f.slice(1) + " Urgency"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} email{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Email cards */}
      <div className="space-y-3">
        {filtered.map((email) => {
          const isExpanded = expanded === email.id;
          const isDraftShown = showDraft === email.id;

          return (
            <div
              key={email.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Email header row */}
              <button
                className="w-full px-4 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : email.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{email.sender}</span>
                    <StatusBadge
                      label={email.urgency.charAt(0).toUpperCase() + email.urgency.slice(1)}
                      variant={urgencyVariant(email.urgency)}
                    />
                    {email.needsCEOApproval && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <AlertTriangle size={10} />
                        CEO Approval
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{email.received}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 font-medium">{email.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{email.summary}</p>
                </div>
                <span className="flex-shrink-0 text-gray-400 mt-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Suggested Action</p>
                      <p className="text-sm text-gray-800">{email.suggestedAction}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Business Impact if Ignored</p>
                      <p className="text-sm text-red-700 font-medium">{email.businessImpact}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDraft(isDraftShown ? null : email.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Bot size={13} />
                    {isDraftShown ? "Hide AI Draft" : "View AI Draft Reply"}
                  </button>

                  {isDraftShown && (
                    <AIInsightBox title="AI Draft Reply">
                      <p className="italic">&ldquo;{email.draft}&rdquo;</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Review and edit before sending.</p>
                    </AIInsightBox>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        All emails are simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
