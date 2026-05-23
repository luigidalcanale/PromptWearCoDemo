import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          {badge && (
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
