"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bell, BellOff, CheckCheck } from "lucide-react";
import { markAllRead, openNotification } from "@/app/(dashboard)/notificaciones/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NotificationIcon } from "@/components/notification-icon";
import { headerButton } from "./header-button";

export interface NotificationPreview {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  /** Ya formateado en el servidor ("hace 5 min") para no desajustar la hidratación */
  ago: string;
}

/** Campana con las últimas notificaciones: abrir una la marca como leída y lleva a su enlace. */
export function NotificationsMenu({ items, unread }: { items: NotificationPreview[]; unread: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // El header vive en el layout y no se desmonta al navegar: cerrar el panel al cambiar de ruta
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger className={headerButton} aria-label={`Notificaciones${unread ? `: ${unread} sin leer` : ""}`}>
            <Bell className="size-4" />
            {unread > 0 && (
              <span
                aria-hidden
                className="absolute -top-1 -right-1 min-w-5 rounded-full bg-primary px-1 text-center text-[10px] leading-5 font-semibold text-primary-foreground tabular-nums ring-2 ring-background"
              >
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Notificaciones</TooltipContent>
      </Tooltip>

      <PopoverContent align="end" sideOffset={8} className="w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="text-sm font-medium">
            Notificaciones
            {unread > 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">{unread} sin leer</span>}
          </p>
          {unread > 0 && (
            <form action={markAllRead}>
              <button className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <CheckCheck aria-hidden className="size-3.5" />
                Marcar todo leído
              </button>
            </form>
          )}
        </div>

        {items.length ? (
          <ul className="max-h-[min(26rem,60vh)] overflow-y-auto p-1.5">
            {items.map((n) => {
              return (
                <li key={n.id}>
                  <form action={openNotification}>
                    <input type="hidden" name="id" value={n.id} />
                    <input type="hidden" name="link" value={n.link ?? ""} />
                    <button className="flex w-full gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
                      <NotificationIcon type={n.type} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className={cn("text-sm leading-snug", !n.read && "font-medium")}>{n.title}</span>
                          {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Sin leer" />}
                        </span>
                        {n.body && <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{n.body}</span>}
                        <span className="mt-1 block text-[11px] text-muted-foreground/80">{n.ago}</span>
                      </span>
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span aria-hidden className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <BellOff className="size-4" />
            </span>
            <p className="text-sm font-medium">Sin notificaciones</p>
            <p className="mt-1 text-xs text-muted-foreground">Aquí verás leads nuevos, presupuestos vistos y avisos.</p>
          </div>
        )}

        <Link
          href="/notificaciones"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-1 border-t border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Ver todas
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </PopoverContent>
    </Popover>
  );
}
