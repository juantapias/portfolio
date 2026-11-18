"use client";

import { useCallback, useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { Nav, type NavBadges } from "./nav";

/**
 * Barra lateral de escritorio, contraíble a solo iconos. El estado se guarda en una
 * cookie para que el servidor la pinte ya con el ancho correcto (sin salto al cargar).
 * Atajo: ⌘B / Ctrl+B.
 */
export function Sidebar({ badges, defaultCollapsed }: { badges: NavBadges; defaultCollapsed: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      document.cookie = `${SIDEBAR_COOKIE}=${!c ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
      return !c;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const label = collapsed ? "Expandir barra lateral" : "Contraer barra lateral";
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 flex-col gap-8 overflow-x-hidden overflow-y-auto rounded-3xl border border-sidebar-border bg-sidebar transition-[width,padding] duration-300 ease-out-expo md:flex print:hidden",
        collapsed ? "w-[4.5rem] px-3 py-4" : "w-64 p-4",
      )}
    >
      <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "justify-between")}>
        <Brand compact={collapsed} />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggle}
              aria-label={label}
              aria-expanded={!collapsed}
              aria-keyshortcuts="Meta+B Control+B"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Icon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {label}
            <kbd className="ml-1 rounded bg-background/20 px-1 font-sans text-[10px]">⌘B</kbd>
          </TooltipContent>
        </Tooltip>
      </div>
      <Nav badges={badges} collapsed={collapsed} />
    </aside>
  );
}
