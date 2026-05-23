import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6 rounded-xl border border-dashed border-border bg-card/50",
        className
      )}
    >
      <div className="relative w-14 h-14 mb-3 flex items-center justify-center text-muted-foreground">
        <span className="absolute inset-0 rounded-full bg-muted/60" />
        <span className="relative">{icon ?? <Inbox size={22} />}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
