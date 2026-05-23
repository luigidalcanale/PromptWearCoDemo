export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
