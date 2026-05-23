import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warning" | "success";
}

const variantStyles = {
  default:
    "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-100",
  warning:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-100",
  success:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-100",
};

const iconStyles = {
  default: "text-blue-500 dark:text-blue-300",
  warning: "text-amber-500 dark:text-amber-300",
  success: "text-green-500 dark:text-green-300",
};

export function AIInsightBox({ title = "AI Insight", children, className, variant = "default" }: AIInsightBoxProps) {
  return (
    <div className={cn("rounded-xl border p-5", variantStyles[variant], className)}>
      <div className="flex items-center gap-2 mb-2">
        <Bot size={15} className={iconStyles[variant]} />
        <span className="text-xs font-semibold tracking-wide opacity-80">{title}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
