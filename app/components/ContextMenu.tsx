"use client";

import { useEffect, useRef, useState, ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

export type ContextMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  variant?: "default" | "danger";
  shortcut?: string;
};

interface Props {
  items: ContextMenuItem[];
  children: ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = (e: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setPos(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPos(null);
    const onScroll = () => setPos(null);
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [pos]);

  const onContext = (e: MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - items.length * 36 - 16);
    setPos({ x, y });
  };

  return (
    <>
      <div onContextMenu={onContext} className={className}>
        {children}
      </div>
      {pos && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: pos.y, left: pos.x }}
          className="no-print fixed z-[70] min-w-[200px] bg-popover text-popover-foreground border border-border rounded-lg shadow-xl py-1 fade-in"
        >
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setPos(null);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-left hover:bg-muted/60 transition-colors",
                item.variant === "danger" && "text-red-600 dark:text-red-400"
              )}
            >
              {item.icon && <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <kbd className="text-[10px] font-mono text-muted-foreground">{item.shortcut}</kbd>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
