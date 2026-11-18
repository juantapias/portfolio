"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { modules } from "@/lib/modules";
import { cn } from "@/lib/utils";
import type { NavBadges } from "./nav";
import { NotificationsMenu, type NotificationPreview } from "./notifications-menu";
import { ThemeMenu } from "./theme-menu";
import { UserMenu } from "./user-menu";

function currentModule(pathname: string) {
  return modules.find((m) => (m.href === "/" ? pathname === "/" : pathname.startsWith(m.href)));
}

/**
 * Header del panel. Escritorio: ubicación a la izquierda y acciones globales (tema,
 * notificaciones, perfil). Móvil: barra de app con el título de la sección y respeto
 * del notch; la navegación vive en la barra de pestañas inferior.
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
  const mod = currentModule(pathname);

  // Patrón iOS: el título grande vive en la página; el de la barra aparece al hacer scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 backdrop-blur-xl transition-[background-color,border-color] duration-300 select-none",
        scrolled ? "border-border bg-background/80" : "border-transparent bg-background/0",
        "md:top-4 md:rounded-3xl md:border md:border-border md:bg-card/80 md:px-4 md:py-2.5 print:hidden",
      )}
    >
      {/* Móvil: título de la sección, como la barra de navegación de una app */}
      <p
        aria-hidden={!scrolled}
        className={cn(
          "min-w-0 truncate text-base font-semibold transition-[opacity,transform] duration-300 ease-out-expo md:hidden",
          scrolled ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        {mod?.label ?? "Admin"}
      </p>

      {/* Escritorio: ubicación */}
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

      <div className="flex shrink-0 items-center gap-2">
        {/* En móvil el tema está en «Más» para dejar la barra limpia */}
        <div className="hidden md:block">
          <ThemeMenu />
        </div>
        <NotificationsMenu items={notifications} unread={badges.notificaciones ?? 0} />
        <span aria-hidden className="mx-1 hidden h-6 w-px bg-border md:block" />
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
