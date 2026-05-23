"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import decisions from "@/data/decisionLog.json";
import { Bot, User, ChevronDown, ChevronRight } from "lucide-react";

export default function DecisionLogPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Decision Log"
        subtitle="AI provides recommendations. Humans make the final call. Every decision is tracked here."
        badge={`${decisions.length} Decisions Today`}
      />

      <AIInsightBox title="AI Demonstration" className="mb-6">
        AI supports decisions, but humans remain responsible for final judgment. This log shows the AI recommendation, the human decision, expected impact, and what was learned.
      </AIInsightBox>

      <div className="space-y-4">
        {decisions.map((d) => {
          const isExpanded = expanded === d.id;
          return (
            <div key={d.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : d.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">D-{String(d.id).padStart(3, "0")}</span>
                    <span className="text-xs text-muted-foreground">{d.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{d.businessIssue}</p>
                  <p className="text-xs text-green-700 font-medium mt-1">âœ“ {d.humanDecision}</p>
                </div>
                <span className="text-muted-foreground mt-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 py-4 bg-muted/30 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot size={12} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-blue-900">{d.aiRecommendation}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <User size={12} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Human Decision</span>
                      </div>
                      <p className="text-sm text-green-900 font-medium">{d.humanDecision}</p>
                      {d.humanNote && <p className="text-xs text-green-700 mt-1 italic">&ldquo;{d.humanNote}&rdquo;</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Expected Impact</p>
                      <p className="text-sm text-foreground">{d.expectedImpact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Lesson Learned</p>
                      <p className="text-sm text-foreground italic">{d.lessonLearned}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
