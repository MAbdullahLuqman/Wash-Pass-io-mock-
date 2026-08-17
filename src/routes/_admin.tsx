import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  LayoutDashboard,
  ScanLine,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { SPRING } from "@/components/ui/spring-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Control center", icon: LayoutDashboard },
  { to: "/operator/portal", label: "Attendant scanner", icon: ScanLine },
] as const;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={SPRING}
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar p-3 md:flex"
      >
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="size-4" />
          </span>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="truncate text-[14px] font-semibold tracking-[-0.02em]"
            >
              Wash Pass Ops
            </motion.span>
          )}
        </Link>

        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="adminNav"
                    transition={SPRING}
                    className="absolute inset-0 -z-10 rounded-xl bg-sidebar-accent"
                  />
                )}
                <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-muted-foreground">
            <span className="relative flex size-2">
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-success"
              />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            {!collapsed && <span>All systems operational</span>}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-muted-foreground">
              <Wifi className="size-3.5" /> Live sync · 1.2s
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={SPRING}>
              <ChevronLeft className="size-4" />
            </motion.span>
            {!collapsed && "Collapse"}
          </button>
        </div>
      </motion.aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
