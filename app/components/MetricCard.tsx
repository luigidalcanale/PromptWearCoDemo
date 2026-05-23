import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { EditableTarget } from "./EditableTarget";

type Status = "healthy" | "warning" | "risk" | "neutral";
type Direction = "up" | "down" | "flat";

interface MetricCardProps {
  label: string;
  /** Display string (e.g. "$3,490"). Used when `numeric` is not provided. */
  value: string;
  /** Optional numeric value. If provided, displays as an animated count-up + pulses on change. */
  numeric?: number;
  /** Formatter used with `numeric`. Defaults to local string. */
  format?: (n: number) => string;
  trend?: string;
  status?: Status;
  direction?: Direction;
  /** If provided alongside `numeric`, shows an editable goal + progress bar. */
  target?: { initial: number; storageKey: string; format?: (n: number) => string };
  className?: string;
}

const statusStyles: Record<Status, string> = {
  healthy: "border-l-green-500",
  warning: "border-l-amber-500",
  risk: "border-l-red-500",
  neutral: "border-l-border",
};

const trendStyles: Record<Status, string> = {
  healthy: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  risk: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

const directionIcon = (d?: Direction) => {
  if (d === "up") return <ArrowUp size={12} />;
  if (d === "down") return <ArrowDown size={12} />;
  if (d === "flat") return <Minus size={12} />;
  return null;
};

export function MetricCard({
  label,
  value,
  numeric,
  format,
  trend,
  status = "neutral",
  direction,
  target,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border p-5 border-l-4 shadow-sm hover:shadow-md transition-shadow",
        statusStyles[status],
        className
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">
        {numeric != null ? (
          <AnimatedNumber value={numeric} format={format ?? ((n) => n.toLocaleString())} />
        ) : (
          value
        )}
      </p>
      {trend && (
        <p className={cn("text-xs mt-1.5 font-medium inline-flex items-center gap-1", trendStyles[status])}>
          {directionIcon(direction)}
          {trend}
        </p>
      )}
      {target && numeric != null && (
        <div className="mt-3">
          <EditableTarget
            current={numeric}
            initialTarget={target.initial}
            storageKey={target.storageKey}
            format={target.format ?? format}
          />
        </div>
      )}
    </div>
  );
}
