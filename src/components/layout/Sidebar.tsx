"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Package,
  Image,
  Users,
  BarChart3,
  Settings,
  Tv,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/lbar-demo", label: "L-Bar Demo", icon: Tv, highlight: true },
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: FileText },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/creatives", label: "Creatives", icon: Image },
  { href: "/audiences", label: "Audiences", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/mcp-monitor", label: "MCP Monitor", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r bg-card min-h-[calc(100vh-64px)]">
      <nav className="py-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isHighlight = 'highlight' in item && item.highlight;
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-primary border-l-3 border-primary",
                  isHighlight && !isActive && "bg-primary/10 text-primary font-semibold"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {isHighlight && (
                  <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    Demo
                  </span>
                )}
              </Link>
              {index === 0 && <div className="my-2 mx-4 border-b" />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
