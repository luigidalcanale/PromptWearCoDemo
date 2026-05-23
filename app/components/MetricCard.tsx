import { cn } from "@/lib/utils";

type Status = "healthy" | "warning" | "risk" | "neutral";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  status?: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  healthy: "border-l-green-500",
  warning: "border-l-amber-500",
  risk: "border-l-red-500",
  neutral: "border-l-gray-300",
};

const trendStyles: Record<Status, string> = {
  healthy: "text-green-600",
  warning: "text-amber-600",
  risk: "text-red-600",
  neutral: "text-gray-500",
};

export function MetricCard({ label, value, trend, status = "neutral", className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-4 border-l-4 shadow-sm hover:shadow-md transition-shadow",
        statusStyles[status],
        className
      )}
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {trend && (
        <p className={cn("text-xs mt-1 font-medium", trendStyles[status])}>{trend}</p>
      )}
    </div>
  );
}
