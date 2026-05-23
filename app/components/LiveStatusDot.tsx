"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type State = "online" | "degraded";

/**
 * Green pulsing dot that occasionally blinks yellow ("degraded") for ~4s, then recovers.
 * Pure CSS pulse — no per-tick rerenders unless state actually changes.
 */
export function LiveStatusDot({
  label,
  className,
  /** Average seconds between degradation events. Default 45s. */
  degradeEveryS = 45,
}: {
  label?: string;
  className?: string;
  degradeEveryS?: number;
}) {
  const [state, setState] = useState<State>("online");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const next = (degradeEveryS * 0.5 + Math.random() * degradeEveryS) * 1000;
      timer = setTimeout(() => {
        setState("degraded");
        timer = setTimeout(() => {
          setState("online");
          scheduleNext();
        }, 3500 + Math.random() * 1500);
      }, next);
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, [degradeEveryS]);

  const color =
    state === "online"
      ? "bg-green-500"
      : "bg-amber-500";
  const text =
    state === "online" ? "Online" : "Degraded";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", color)} />
        <span className={cn("relative inline-flex rounded-full w-2 h-2", color)} />
      </span>
      {label !== undefined && (
        <span className="text-xs text-muted-foreground">
          {label === "" ? text : label}
        </span>
      )}
    </span>
  );
}
