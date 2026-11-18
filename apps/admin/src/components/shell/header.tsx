"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { modules } from "@/lib/modules";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { headerButton } from "./header-button";
import { Nav, type NavBadges } from "./nav";
import { NotificationsMenu, type NotificationPreview } from "./notifications-menu";
import { ThemeMenu } from "./theme-menu";
import { UserMenu } from "./user-menu";

function currentModule(pathname: string) {
  return modules.find((m) => (m.href === "/" ? pathname === "/" : pathname.startsWith(m.href)));
}

/**
 * Header del panel: ubicación actual a la izquierda y acciones globales a la derecha
 * (tema, notificaciones y perfil). En móvil también abre el cajón de navegación.
 */
export function Header({
  badges,
  name,
  email,
  notifications,
}: {
  badges: NavBadges;
  name?: string | null;
  email?: string;
  notifications: NotificationPreview[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mod = currentModule(pathname);

  // Cerrar el cajón al cambiar de ruta (también con atrás/adelante): ajuste de estado durante el render
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Con el cajón abierto: sin scroll de fondo, foco en «cerrar» y Escape para salir
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:top-4 md:rounded-3xl md:border md:bg-card/80 md:px-4 md:py-2.5 print:hidden">
        {/* Izquierda: menú + marca (móvil) / ubicación (escritorio) */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className={cn(headerButton, "md:hidden")}
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="size-4" />
          </button>
          <div className="md:hidden">
            <Brand />
          </div>
          {mod && (
            <nav aria-label="Ubicación" className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
              <span className="text-muted-foreground">{mod.group}</span>
              <ChevronRight aria-hidden className="size-3.5 text-muted-foreground/60" />
              <span aria-current="page" className="flex items-center gap-2 truncate font-medium">
                <mod.icon aria-hidden className="size-4 text-brand" />
                {mod.label}
              </span>
            </nav>
          )}
        </div>

        {/* Derecha: acciones globales */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeMenu />
          <NotificationsMenu items={notifications} unread={badges.notificaciones ?? 0} />
          <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
          <UserMenu name={name} email={email} />
        </div>
      </header>

      {/* Cajón de navegación (móvil) */}
      <div
        className={cn("fixed inset-0 z-40 md:hidden", open ? "visible" : "invisible")}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
      >
        <div
          className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto border-r border-border bg-sidebar p-4 transition-transform duration-300 ease-out-expo",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Brand onNavigate={() => setOpen(false)} />
            <button ref={closeRef} type="button" className={headerButton} onClick={() => setOpen(false)} aria-label="Cerrar menú">
              <X className="size-4" />
            </button>
          </div>
          <Nav badges={badges} onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
