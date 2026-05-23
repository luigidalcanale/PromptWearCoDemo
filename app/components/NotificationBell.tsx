"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, AlertTriangle, Package, Mail, TrendingUp } from "lucide-react";

type Notif = {
  id: number;
  title: string;
  body: string;
  time: string;
  icon: "alert" | "stock" | "mail" | "trend";
  read: boolean;
};

const INITIAL: Notif[] = [
  {
    id: 1,
    title: "Built With AI Hoodie — low stock",
    body: "Only 8 units left. Forecasted stockout in ~4 days.",
    time: "12 min ago",
    icon: "stock",
    read: false,
  },
  {
    id: 2,
    title: "New high-value email — LaunchHaus Accelerator",
    body: "Inquiry for 220 hoodies (~$10,120). Needs CEO approval.",
    time: "1 hr ago",
    icon: "mail",
    read: false,
  },
  {
    id: 3,
    title: "Hoodie ad ROAS at 3.8×",
    body: "MetaPromo recommends scaling budget +20% for 48 hours.",
    time: "2 hr ago",
    icon: "trend",
    read: false,
  },
  {
    id: 4,
    title: "Checkout error spike",
    body: "11 mobile Safari sessions failed yesterday. Patch in progress.",
    time: "3 hr ago",
    icon: "alert",
    read: true,
  },
];

const ICON_MAP = {
  alert: AlertTriangle,
  stock: Package,
  mail: Mail,
  trend: TrendingUp,
};

const ICON_COLOR = {
  alert: "text-red-600 dark:text-red-400",
  stock: "text-amber-600 dark:text-amber-400",
  mail: "text-blue-600 dark:text-blue-400",
  trend: "text-violet-600 dark:text-violet-400",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-lg border border-border bg-card hover:bg-muted/50 flex items-center justify-center transition-colors"
      >
        <Bell size={15} className="text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(92vw,360px)] bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-toast-in">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-border">
            {notifs.map((n) => {
              const Icon = ICON_MAP[n.icon];
              return (
                <div
                  key={n.id}
                  className={`px-4 py-3 flex gap-3 hover:bg-muted/40 transition-colors cursor-pointer ${
                    !n.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() =>
                    setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                  }
                >
                  <Icon size={16} className={`flex-shrink-0 mt-0.5 ${ICON_COLOR[n.icon]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground">Simulated for portfolio demo</p>
          </div>
        </div>
      )}
    </div>
  );
}
