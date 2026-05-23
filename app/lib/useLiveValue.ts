"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** ±% drift per tick. Default 0.005 = ±0.5% */
  drift?: number;
  /** ms between ticks. Random within [min, max]. Default 3000–8000 */
  intervalMs?: [number, number];
  /** Clamp to [base*(1-maxDeviation), base*(1+maxDeviation)] so values don't run away. Default 0.04 */
  maxDeviation?: number;
};

/**
 * Returns a value that drifts around `base` at a slow rate, simulating live telemetry.
 * Pauses while the tab is hidden so it doesn't waste cycles.
 */
export function useLiveValue(base: number, opts: Options = {}) {
  const { drift = 0.005, intervalMs = [3000, 8000], maxDeviation = 0.04 } = opts;
  const [value, setValue] = useState(base);
  const baseRef = useRef(base);
  baseRef.current = base;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (typeof document !== "undefined" && document.hidden) {
        timer = setTimeout(tick, 1500);
        return;
      }
      setValue((prev) => {
        const change = (Math.random() * 2 - 1) * drift;
        let next = prev * (1 + change);
        const min = baseRef.current * (1 - maxDeviation);
        const max = baseRef.current * (1 + maxDeviation);
        if (next < min) next = min + (baseRef.current - min) * 0.1;
        if (next > max) next = max - (max - baseRef.current) * 0.1;
        return next;
      });
      const [lo, hi] = intervalMs;
      timer = setTimeout(tick, lo + Math.random() * (hi - lo));
    };

    timer = setTimeout(tick, intervalMs[0]);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [drift, intervalMs, maxDeviation]);

  return value;
}
