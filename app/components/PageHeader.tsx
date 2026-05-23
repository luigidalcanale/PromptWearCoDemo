interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {badge && (
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
