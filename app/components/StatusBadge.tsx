import { cn } from "@/lib/utils";

type Variant = "healthy" | "warning" | "risk" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  healthy: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  risk: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
};

export function StatusBadge({ label, variant = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export function riskToVariant(risk: string): Variant {
  const lower = risk.toLowerCase();
  if (lower === "high") return "risk";
  if (lower === "medium" || lower === "watch") return "warning";
  if (lower === "low" || lower === "healthy") return "healthy";
  if (lower === "scale" || lower === "strong" || lower === "continue") return "healthy";
  if (lower === "pause") return "risk";
  return "neutral";
}
