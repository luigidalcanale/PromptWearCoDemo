"use client";

import { ActivityTicker } from "./ActivityTicker";
import { NotificationBell } from "./NotificationBell";

export function TopBar() {
  return (
    <div className="no-print sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border h-12 px-4 lg:px-6 flex items-center gap-4">
      <ActivityTicker />
      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
      </div>
    </div>
  );
}
