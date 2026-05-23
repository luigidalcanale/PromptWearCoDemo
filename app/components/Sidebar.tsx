"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Mail,
  ShoppingCart,
  TrendingUp,
  Package,
  Megaphone,
  Headphones,
  FileText,
  DollarSign,
  Zap,
  ClipboardList,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "CEO Home", href: "/", icon: Home },
  { label: "Email Command Center", href: "/email-command-center", icon: Mail },
  { label: "Sales Dashboard", href: "/sales", icon: ShoppingCart },
  { label: "Sales Forecasting", href: "/forecasting", icon: TrendingUp },
  { label: "Inventory & Suppliers", href: "/inventory", icon: Package },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Customer Service", href: "/customer-service", icon: Headphones },
  { label: "Meeting Notes", href: "/meetings", icon: FileText },
  { label: "Finance", href: "/finance", icon: DollarSign },
  { label: "AI Automation Map", href: "/automation-map", icon: Zap },
  { label: "Decision Log", href: "/decision-log", icon: ClipboardList },
  { label: "Case Study", href: "/case-study", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="no-print lg:hidden fixed top-8 left-0 right-0 z-30 h-14 bg-sidebar text-sidebar-foreground border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo size={26} className="text-sidebar-primary-foreground bg-sidebar-primary rounded-md p-1" />
          <span className="text-sm font-semibold">PromptWear Co.</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            className="w-9 h-9 rounded-lg border border-sidebar-border flex items-center justify-center"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <button
          aria-label="Close menu backdrop"
          className="no-print lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop static, mobile drawer) */}
      <aside
        className={`no-print bg-sidebar text-sidebar-foreground flex flex-col shrink-0 h-full overflow-y-auto border-r border-sidebar-border z-40
        w-64
        fixed lg:static top-0 left-0
        transition-transform duration-200 ease-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        pt-14 lg:pt-0
        `}
      >
        {/* Brand (desktop only) */}
        <div className="hidden lg:flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">
              <Logo size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">PromptWear Co.</p>
              <p className="text-xs text-sidebar-foreground/60 leading-tight">Command Center</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-sidebar-border space-y-1">
          <p className="text-xs text-sidebar-foreground/60">
            Press{" "}
            <kbd className="px-1 py-0.5 text-[10px] font-mono bg-sidebar-accent border border-sidebar-border rounded">
              ⌘K
            </kbd>{" "}
            to search
          </p>
          <p className="text-xs text-sidebar-foreground/40">
            Built by <span className="text-sidebar-foreground/60">Luigi Dalcanale</span>
          </p>
        </div>
      </aside>
    </>
  );
}
