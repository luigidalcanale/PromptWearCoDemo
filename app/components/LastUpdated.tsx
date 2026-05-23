"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LastUpdated({ minutesAgo = 3 }: { minutesAgo?: number }) {
  const [text, setText] = useState(`Updated ${minutesAgo} min ago`);

  useEffect(() => {
    const start = Date.now() - minutesAgo * 60_000;
    const tick = () => {
      const diffMin = Math.floor((Date.now() - start) / 60_000);
      if (diffMin < 1) setText("Updated just now");
      else if (diffMin < 60) setText(`Updated ${diffMin} min ago`);
      else setText(`Updated ${Math.floor(diffMin / 60)} hr ago`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [minutesAgo]);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock size={11} />
      {text}
    </span>
  );
}
