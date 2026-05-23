"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/Toaster";
import { useTypewriter } from "@/components/useTypewriter";
import emails from "@/data/emails.json";
import {
  ChevronDown,
  ChevronRight,
  Bot,
  AlertTriangle,
  Send,
  Pencil,
  CheckCircle2,
} from "lucide-react";

type UrgencyFilter = "all" | "high" | "medium" | "low";

const urgencyVariant = (u: string): "risk" | "warning" | "info" | "neutral" => {
  if (u === "high") return "risk";
  if (u === "medium") return "warning";
  if (u === "low") return "info";
  return "neutral";
};

export default function EmailCommandCenterPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<UrgencyFilter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showDraft, setShowDraft] = useState<number | null>(null);
  const [sent, setSent] = useState<Record<number, boolean>>({});

  const filtered = emails.filter((e) => filter === "all" || e.urgency === filter);
  const sentCount = Object.values(sent).filter(Boolean).length;

  const handleSend = (id: number, sender: string) => {
    setSent((s) => ({ ...s, [id]: true }));
    setShowDraft(null);
    toast({
      variant: "success",
      title: `Reply sent to ${sender}`,
      description: "Logged to email thread. AI will follow up if no response in 48h.",
    });
  };

  const handleEdit = (sender: string) => {
    toast({
      variant: "info",
      title: `Editing draft to ${sender}`,
      description: "Opening in your default editor (demo).",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="AI Email Command Center"
        subtitle="AI summarizes emails, flags urgency, estimates business impact, and drafts replies."
        badge={`${emails.length} emails today`}
      />

      {/* Urgency filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "high", "medium", "low"] as UrgencyFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? "bg-foreground text-background border-gray-900"
                : "bg-card text-muted-foreground border-border hover:bg-muted/30"
            }`}
          >
            {f === "all" ? "All Emails" : f.charAt(0).toUpperCase() + f.slice(1) + " Urgency"}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">
          {filtered.length} email{filtered.length !== 1 ? "s" : ""}
          {sentCount > 0 && (
            <span className="ml-2 text-green-700 dark:text-green-400 font-medium">
              · {sentCount} replied
            </span>
          )}
        </span>
      </div>

      {/* Email cards */}
      <div className="space-y-3">
        {filtered.map((email) => {
          const isExpanded = expanded === email.id;
          const isDraftShown = showDraft === email.id;
          const isSent = !!sent[email.id];

          return (
            <div
              key={email.id}
              className={`bg-card rounded-xl border shadow-sm overflow-hidden transition-colors ${
                isSent ? "border-green-300/60 dark:border-green-800/60" : "border-border"
              }`}
            >
              {/* Email header row */}
              <button
                className="w-full px-4 py-4 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : email.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{email.sender}</span>
                    <StatusBadge
                      label={email.urgency.charAt(0).toUpperCase() + email.urgency.slice(1)}
                      variant={urgencyVariant(email.urgency)}
                    />
                    {email.needsCEOApproval && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800">
                        <AlertTriangle size={10} />
                        CEO Approval
                      </span>
                    )}
                    {isSent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800">
                        <CheckCircle2 size={10} />
                        Replied
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{email.received}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5 font-medium">{email.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{email.summary}</p>
                </div>
                <span className="flex-shrink-0 text-muted-foreground mt-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border px-4 py-4 bg-muted/30 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Suggested Action
                      </p>
                      <p className="text-sm text-foreground">{email.suggestedAction}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Business Impact if Ignored
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                        {email.businessImpact}
                      </p>
                    </div>
                  </div>

                  {!isDraftShown && !isSent && (
                    <button
                      onClick={() => setShowDraft(email.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Bot size={13} />
                      View AI Draft Reply
                    </button>
                  )}

                  {isDraftShown && (
                    <DraftPanel
                      draft={email.draft}
                      onSend={() => handleSend(email.id, email.sender)}
                      onEdit={() => handleEdit(email.sender)}
                      onClose={() => setShowDraft(null)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All emails are simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}

function DraftPanel({
  draft,
  onSend,
  onEdit,
  onClose,
}: {
  draft: string;
  onSend: () => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  const { text, done } = useTypewriter(draft, 10, draft);

  return (
    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Bot size={14} className="text-blue-600 dark:text-blue-400" />
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
          AI Draft Reply
        </p>
        {!done && (
          <span className="text-[11px] text-blue-700 dark:text-blue-300 ml-auto">drafting…</span>
        )}
      </div>
      <p className={`italic text-sm text-foreground leading-relaxed ${!done ? "caret-blink" : ""}`}>
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={onSend}
          disabled={!done}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
        >
          <Send size={12} /> Send Draft
        </button>
        <button
          onClick={onEdit}
          disabled={!done}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground ml-auto"
        >
          Hide draft
        </button>
      </div>
    </div>
  );
}
