"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/Toaster";
import csData from "@/data/serviceTickets.json";
import {
  Bot, ChevronDown, ChevronRight, CheckCircle,
  CheckSquare, Square, Archive, X, Inbox,
} from "lucide-react";

type Ticket = (typeof csData.tickets)[number];

const urgencyVariant = (u: string): "risk" | "warning" | "info" | "neutral" =>
  u === "high" ? "risk" : u === "medium" ? "warning" : u === "low" ? "info" : "neutral";

export default function CustomerServicePage() {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDraft, setShowDraft] = useState<string | null>(null);
  const [archived, setArchived] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visible = useMemo(
    () => csData.tickets.filter((t) => !archived.has(t.id)),
    [archived]
  );

  const allChecked = visible.length > 0 && visible.every((t) => selected.has(t.id));
  const someChecked = visible.some((t) => selected.has(t.id));

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(visible.map((t) => t.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const archiveSelected = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setArchived((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setSelected(new Set());
    toast({
      variant: "info",
      title: `Archived ${ids.length} ticket${ids.length === 1 ? "" : "s"}`,
      description: "They've been moved out of the open queue.",
      onUndo: () => {
        setArchived((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
      },
    });
  };

  const resolveSelected = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setArchived((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setSelected(new Set());
    toast({
      variant: "success",
      title: `Resolved ${ids.length} ticket${ids.length === 1 ? "" : "s"}`,
      description: "AI drafts marked sent and tickets closed.",
      onUndo: () => {
        setArchived((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Customer Service Center"
        subtitle="AI clusters complaints, drafts responses, and recommends process improvements"
        badge={`${visible.length} Open Tickets`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard label="CSAT Score" value="4.3 / 5" numeric={4.3} format={(n) => `${n.toFixed(1)} / 5`} status="healthy" />
        <MetricCard label="Avg Response" value="3.2 hrs" numeric={3.2} format={(n) => `${n.toFixed(1)} hrs`} status="warning" />
        <MetricCard label="Open Tickets" value={String(visible.length)} numeric={visible.length} status="warning" />
        <MetricCard label="Resolved Today" value="9" numeric={9} status="healthy" />
        <MetricCard label="Refund Rate" value="4.3%" numeric={4.3} format={(n) => `${n.toFixed(1)}%`} status="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Issues Today — by Type</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 text-left">Issue Type</th>
                <th className="px-4 py-3 text-right">Count</th>
                <th className="px-4 py-3 text-left">Theme</th>
              </tr>
            </thead>
            <tbody>
              {csData.issueSummary.map((s) => (
                <tr key={s.type} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{s.count}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{s.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500" />
            AI-Suggested Service Improvements
          </h2>
          <ul className="space-y-2.5">
            {csData.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Open Tickets with AI Draft Responses</h2>
        <button
          onClick={toggleAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        >
          {allChecked ? <CheckSquare size={13} /> : <Square size={13} />}
          {allChecked ? "Unselect all" : "Select all"}
        </button>
      </div>

      <div className="space-y-3 pb-24">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Inbox size={22} />}
            title="Inbox zero"
            description="No open tickets right now. New ones will appear here as customers reach out."
            action={
              archived.size > 0 && (
                <button
                  onClick={() => setArchived(new Set())}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Restore {archived.size} archived
                </button>
              )
            }
          />
        ) : (
          visible.map((ticket: Ticket) => {
            const isExpanded = expanded === ticket.id;
            const isDraftShown = showDraft === ticket.id;
            const isChecked = selected.has(ticket.id);

            return (
              <div
                key={ticket.id}
                className={`bg-card rounded-xl border shadow-sm overflow-hidden transition-colors ${
                  isChecked ? "border-blue-500/60 ring-1 ring-blue-500/30" : "border-border"
                }`}
              >
                <div className="flex items-stretch">
                  <button
                    onClick={() => toggleOne(ticket.id)}
                    aria-label={isChecked ? "Unselect" : "Select"}
                    className="flex-shrink-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-blue-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                  <button
                    className="flex-1 px-2 py-4 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : ticket.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                        <span className="text-sm font-semibold text-foreground">{ticket.customer}</span>
                        <StatusBadge
                          label={ticket.urgency.charAt(0).toUpperCase() + ticket.urgency.slice(1)}
                          variant={urgencyVariant(ticket.urgency)}
                        />
                        <StatusBadge label={ticket.type} variant="neutral" />
                        <span className="ml-auto text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-200">{ticket.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.issue}</p>
                    </div>
                    <span className="flex-shrink-0 text-muted-foreground mt-1 pr-4">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Suggested Resolution: <span className="text-foreground">{ticket.resolution}</span>
                      </p>
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
          })
        )}
      </div>

      {/* Sticky bulk action bar */}
      <div
        className={`no-print fixed left-1/2 -translate-x-1/2 z-40 bottom-6 transition-all duration-300 ${
          someChecked ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-foreground text-background rounded-full shadow-2xl pl-5 pr-2 py-2 border border-border">
          <span className="text-xs font-semibold">
            {selected.size} selected
          </span>
          <span className="w-px h-5 bg-background/20" />
          <button
            onClick={resolveSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            <CheckCircle size={12} /> Resolve
          </button>
          <button
            onClick={archiveSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/15 hover:bg-background/25 text-background text-xs font-semibold transition-colors"
          >
            <Archive size={12} /> Archive
          </button>
          <button
            onClick={() => setSelected(new Set())}
            aria-label="Clear selection"
            className="p-1.5 rounded-full hover:bg-background/15 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
