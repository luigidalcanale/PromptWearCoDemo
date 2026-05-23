"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  /** Function that formats the displayed value, e.g. (n) => `$${n.toFixed(0)}` */
  format?: (n: number) => string;
  /** ms for the initial count-up animation */
  duration?: number;
  /** Flash green on increase / red on decrease when value changes after mount */
  pulse?: boolean;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }),
  duration = 900,
  pulse = true,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevValueRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    if (from === to) return;

    if (mountedRef.current && pulse) {
      setFlash(to > from ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 700);
      const start = performance.now();
      let raf: number;
      const tickShort = (now: number) => {
        const p = Math.min(1, (now - start) / 350);
        setDisplay(from + (to - from) * easeOut(p));
        if (p < 1) raf = requestAnimationFrame(tickShort);
      };
      raf = requestAnimationFrame(tickShort);
      prevValueRef.current = to;
      return () => {
        clearTimeout(t);
        cancelAnimationFrame(raf);
      };
    }

    // Initial mount: count up from 0
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(to * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else mountedRef.current = true;
    };
    raf = requestAnimationFrame(tick);
    prevValueRef.current = to;
    return () => cancelAnimationFrame(raf);
  }, [value, duration, pulse]);

  return (
    <span
      className={cn(
        "tabular-nums transition-colors duration-300",
        flash === "up" && "text-green-600 dark:text-green-400",
        flash === "down" && "text-red-600 dark:text-red-400",
        className
      )}
    >
      {format(display)}
    </span>
  );
}
