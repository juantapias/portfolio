"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MODULE_GROUPS, modules } from "@/lib/modules";
import { cn } from "@/lib/utils";

export type NavBadges = Partial<Record<string, number>>;

/**
 * Navegación principal agrupada por área. Un único fondo («pill») se desliza hasta
 * el ítem activo al navegar; el icono activo pasa a un círculo naranja.
 * `collapsed` la reduce a solo iconos, con el nombre en un tooltip.
 */
export function Nav({
  badges = {},
  onNavigate,
  collapsed = false,
}: {
  badges?: NavBadges;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Coloca el pill sobre el enlace activo. Se escribe directo en el DOM (sin estado):
  // así no hay renders extra y la transición CSS hace la animación.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    const place = () => {
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active) {
        pill.style.opacity = "0";
        return;
      }
      const n = nav.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      pill.style.opacity = "1";
      pill.style.transform = `translate(${a.left - n.left}px, ${a.top - n.top}px)`;
      pill.style.width = `${a.width}px`;
      pill.style.height = `${a.height}px`;
    };

    place();
    // La primera colocación es instantánea; a partir de ahí, animada
    requestAnimationFrame(() => (nav.dataset.ready = "true"));

    // Reajustar si cambia el tamaño (contraer/expandir la barra, fuentes que cargan…)
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [pathname, collapsed]);

  return (
    <nav ref={navRef} aria-label="Principal" className="group/nav relative flex flex-col gap-5">
      <span
        ref={pillRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full bg-sidebar-accent opacity-0 shadow-[inset_0_0_0_1px_var(--sidebar-border)] group-data-[ready=true]/nav:transition-[transform,width,height,opacity] group-data-[ready=true]/nav:duration-500 group-data-[ready=true]/nav:ease-out-expo"
      />

      {MODULE_GROUPS.map((group) => (
        <div key={group}>
          {collapsed ? (
            <span aria-hidden className="mx-auto mb-2 block h-px w-6 bg-sidebar-border" />
          ) : (
            <p className="mb-1.5 px-3 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-muted-foreground/80 uppercase">
              {group}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {modules
              .filter((m) => m.group === group)
              .map((m) => {
                const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
                const count = badges[m.key] ?? 0;
                const Icon = m.icon;

                const link = (
                  <Link
                    href={m.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    aria-label={collapsed ? `${m.label}${count ? ` (${count} sin leer)` : ""}` : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-full py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-ring",
                      collapsed ? "justify-center px-1.5" : "pr-3 pl-1.5",
                      active
                        ? // Hasta que el pill se coloque (antes de hidratar), el fondo lo pone el propio enlace
                          "bg-sidebar-accent font-medium text-foreground group-data-[ready=true]/nav:bg-transparent"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-300 ease-out-expo",
                        active ? "scale-100 bg-primary text-primary-foreground" : "scale-95 group-hover:scale-100 group-hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {collapsed && count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-sidebar" />
                      )}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{m.label}</span>
                        {count > 0 && (
                          <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-[11px] leading-5 font-semibold text-primary-foreground tabular-nums">
                            {count > 99 ? "99+" : count}
                            <span className="sr-only"> sin leer</span>
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );

                return (
                  <li key={m.key}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={10}>
                          {m.label}
                          {count > 0 && <span className="opacity-70">· {count}</span>}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
