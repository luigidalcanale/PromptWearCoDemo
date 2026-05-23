"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  current: number;
  initialTarget: number;
  storageKey: string;
  label?: string;
  format?: (n: number) => string;
  className?: string;
}

export function EditableTarget({
  current,
  initialTarget,
  storageKey,
  label = "Goal",
  format = (n) => n.toLocaleString(),
  className,
}: Props) {
  const [target, setTarget] = useState(initialTarget);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(initialTarget));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`target:${storageKey}`);
    if (stored) {
      const n = Number(stored);
      if (!Number.isNaN(n)) {
        setTarget(n);
        setDraft(String(n));
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const n = Number(draft.replace(/[^\d.]/g, ""));
    if (!Number.isNaN(n) && n > 0) {
      setTarget(n);
      localStorage.setItem(`target:${storageKey}`, String(n));
    } else {
      setDraft(String(target));
    }
    setEditing(false);
  };

  const pct = Math.min(100, Math.round((current / target) * 100));
  const barColor =
    pct >= 100 ? "bg-green-500" : pct >= 75 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {label}:{" "}
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(String(target));
                  setEditing(false);
                }
              }}
              className="w-20 px-1 py-0 bg-background border border-border rounded text-xs text-foreground tabular-nums focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="group inline-flex items-center gap-1 font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Click to edit target"
            >
              {format(target)}
              <Pencil size={9} className="opacity-0 group-hover:opacity-70 transition-opacity" />
            </button>
          )}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
