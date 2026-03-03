"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCode2,
  Database,
  Beaker,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Proyectos", icon: FileCode2, href: "/prompts" },
  { name: "Datasets", icon: Database, href: "/datasets" },
  { name: "Evaluaciones", icon: Beaker, href: "/evaluations" },
  { name: "Benchmarks", icon: ShieldCheck, href: "/benchmarks" },
  { name: "Configuración", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-pip-800 bg-pip-950 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-pip-800">
        {!isCollapsed && (
          <span className="text-xl font-bold text-white">
            Prompt<span className="text-accent">Vault</span>
          </span>
        )}
        {isCollapsed && <span className="text-xl font-bold text-accent mx-auto">PV</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-pip-400 hover:bg-pip-900 hover:text-pip-100",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-accent" : "text-pip-400")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-pip-800 p-3 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-pip-400 hover:text-pip-100 hover:bg-pip-900",
            isCollapsed && "justify-center px-0"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : (
            <>
              <ChevronLeft className="h-5 w-5 mr-3" />
              <span>Contraer</span>
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30",
            isCollapsed && "justify-center px-0"
          )}
          onClick={() => signOut()}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  );
}
