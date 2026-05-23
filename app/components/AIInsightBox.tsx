import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warning" | "success";
}

const variantStyles = {
  default: "bg-blue-50 border-blue-200 text-blue-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-green-50 border-green-200 text-green-900",
};

const iconStyles = {
  default: "text-blue-500",
  warning: "text-amber-500",
  success: "text-green-500",
};

export function AIInsightBox({ title = "AI Insight", children, className, variant = "default" }: AIInsightBoxProps) {
  return (
    <div className={cn("rounded-xl border p-4", variantStyles[variant], className)}>
      <div className="flex items-center gap-2 mb-2">
        <Bot size={15} className={iconStyles[variant]} />
        <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{title}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
