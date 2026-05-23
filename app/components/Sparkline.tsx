"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

type Props = {
  data: number[];
  /** "up" | "down" | "auto". Auto compares first vs last. */
  trend?: "up" | "down" | "auto";
  width?: number | string;
  height?: number;
};

const COLORS = {
  up: "var(--chart-3)",
  down: "#ef4444",
};

export function Sparkline({ data, trend = "auto", width = 90, height = 28 }: Props) {
  if (!data?.length) return null;
  const resolved =
    trend === "auto"
      ? data[data.length - 1] >= data[0]
        ? "up"
        : "down"
      : trend;
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width, height }} className="inline-block">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={COLORS[resolved]}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Generate a deterministic-ish 7-point trend from a seed string. */
export function trendFromSeed(seed: string, points = 7, base = 50, swing = 0.4): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return (h & 0xffff) / 0xffff;
  };
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = Math.max(1, v * (1 + (rand() - 0.45) * swing));
    out.push(v);
  }
  return out;
}
