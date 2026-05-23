"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useTypewriter } from "./useTypewriter";

type Msg = { id: number; role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "What were today's top sellers?",
  "Why is conversion below goal?",
  "Should I approve the hoodie reorder?",
  "Summarize urgent emails",
];

// Lightweight keyword-based "AI" responder. Returns a contextual answer.
function answerFor(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("top seller") || s.includes("best seller") || s.includes("top product")) {
    return "Today's top sellers: Built With AI Hoodie ($1,566 revenue, 27 units) and Prompt Engineer Tee ($1,088, 34 units). Together they're ~76% of today's revenue. The hoodie has the higher per-unit margin in absolute terms, so the inventory risk on it matters most.";
  }
  if (s.includes("conversion")) {
    return "Conversion is 1.9% vs. a 2.2% goal. Two likely drivers: (1) Mobile Safari checkout errors flagged by Shopify support this morning — ~11 carts lost yesterday. (2) Sizing-related refunds are elevated, which historically correlates with PDP hesitation. I'd patch the checkout bug first.";
  }
  if (s.includes("reorder") || s.includes("hoodie")) {
    return "Recommend: approve the 150-unit Built With AI Hoodie reorder today. Current sell-through rate suggests stockout in ~4 days, and the StitchHub supplier is already 4 days delayed on blanks. Even with the reorder approved, you'll have a 1-2 day gap unless you also request a partial shipment.";
  }
  if (s.includes("email") || s.includes("urgent")) {
    return "5 urgent emails: StitchHub supplier delay, MetaPromo wants budget approval, Campus AI Club bulk inquiry ($1,650), LaunchHaus 220-unit cohort order ($10,120), and a Shopify checkout-error report. The LaunchHaus deal is the largest single revenue opportunity in the inbox.";
  }
  if (s.includes("refund") || s.includes("return")) {
    return "4 refunds today totaling $148. Two are sizing-related, one late delivery, one changed mind. Sizing is the recurring theme — moving the size chart higher on hoodie/tee PDPs should reduce this within 2 weeks.";
  }
  if (s.includes("cash") || s.includes("runway") || s.includes("balance")) {
    return "Cash balance is $18,420 with a healthy short-term runway. Today's largest cash commitments would be the hoodie reorder (~$3,900 at $26 cost × 150) and the ad budget bump. Both fit comfortably.";
  }
  if (s.includes("ad") || s.includes("spend") || s.includes("roas")) {
    return "Hoodie ad is the best performer at 3.8x ROAS. Tote ad is at 1.0x — losing money after fees. Recommendation: scale hoodie +20% for 48h, pause tote immediately, reallocate that budget to email retargeting (cheapest channel today).";
  }
  if (s.includes("hi") || s.includes("hello") || s.includes("hey")) {
    return "Hi — I'm your AI ops assistant. Ask me about today's sales, inventory risks, the inbox, or whether to approve a specific action.";
  }
  return "I can answer questions about today's sales, inventory, marketing performance, the inbox, and pending approvals. Try: \"Should I approve the hoodie reorder?\" or \"Summarize urgent emails.\"";
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "ai",
      text: "Hi — I'm your AI ops assistant. Ask me anything about today's business.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter for the currently-streaming AI message
  const { text: streamed, done } = useTypewriter(pending ?? "", 12, pending);

  useEffect(() => {
    if (done && pending) {
      setMessages((m) => [...m, { id: Date.now(), role: "ai", text: pending }]);
      setPending(null);
    }
  }, [done, pending]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamed]);

  const send = (q: string) => {
    if (!q.trim() || pending) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: q }]);
    setInput("");
    // Small "thinking" delay before the typewriter starts
    setTimeout(() => setPending(answerFor(q)), 380);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI assistant"
        className="no-print fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {open && (
        <div className="no-print fixed bottom-24 right-5 z-40 w-[min(92vw,380px)] h-[min(70vh,520px)] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-toast-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center gap-2">
            <Bot size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">PromptWear AI</p>
              <p className="text-[11px] opacity-80 leading-tight">Trained on today's business data</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-300 ping-dot" />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m) => (
              <MsgBubble key={m.id} role={m.role} text={m.text} />
            ))}
            {pending && <MsgBubble role="ai" text={streamed} typing />}
            {messages.length <= 1 && !pending && (
              <div className="pt-2">
                <p className="text-[11px] text-muted-foreground mb-2 px-1">Try asking</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted/40 hover:bg-muted transition-colors text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-2 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about today's business..."
              className="flex-1 bg-muted/40 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || !!pending}
              className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MsgBubble({ role, text, typing }: { role: "user" | "ai"; text: string; typing?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
          isUser
            ? "bg-foreground text-background rounded-br-sm"
            : "bg-muted/60 text-foreground rounded-bl-sm"
        } ${typing ? "caret-blink" : ""}`}
      >
        {text}
      </div>
    </div>
  );
}
