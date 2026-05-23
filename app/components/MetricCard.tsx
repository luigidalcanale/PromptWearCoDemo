import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

type Status = "healthy" | "warning" | "risk" | "neutral";
type Direction = "up" | "down" | "flat";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  status?: Status;
  direction?: Direction;
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
  trend,
  status = "neutral",
  direction,
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
      <p className="text-2xl font-bold text-foreground mt-1.5 tabular-nums">{value}</p>
      {trend && (
        <p className={cn("text-xs mt-1.5 font-medium inline-flex items-center gap-1", trendStyles[status])}>
          {directionIcon(direction)}
          {trend}
        </p>
      )}
    </div>
  );
}
