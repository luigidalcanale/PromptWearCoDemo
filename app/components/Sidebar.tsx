"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  ShoppingCart,
  TrendingUp,
  Package,
  Megaphone,
  HeadphonesIcon,
  FileText,
  DollarSign,
  Zap,
  ClipboardList,
  BookOpen,
} from "lucide-react";

const navItems = [
  { label: "CEO Home", href: "/", icon: Home },
  { label: "Email Command Center", href: "/email-command-center", icon: Mail },
  { label: "Sales Dashboard", href: "/sales", icon: ShoppingCart },
  { label: "Sales Forecasting", href: "/forecasting", icon: TrendingUp },
  { label: "Inventory & Suppliers", href: "/inventory", icon: Package },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Customer Service", href: "/customer-service", icon: HeadphonesIcon },
  { label: "Meeting Notes", href: "/meetings", icon: FileText },
  { label: "Finance", href: "/finance", icon: DollarSign },
  { label: "AI Automation Map", href: "/automation-map", icon: Zap },
  { label: "Decision Log", href: "/decision-log", icon: ClipboardList },
  { label: "Case Study", href: "/case-study", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">PromptWear Co.</p>
            <p className="text-xs text-gray-400 leading-tight">Command Center</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Thu, May 21, 2026</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">Portfolio Demo</p>
        <p className="text-xs text-gray-600 mt-0.5">All data is simulated</p>
      </div>
    </aside>
  );
}
