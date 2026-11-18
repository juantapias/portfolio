"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Ellipsis, ExternalLink, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { getModule, modules, type ModuleKey } from "@/lib/modules";
import { applyPreference, readPreference, subscribePreference, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { BottomSheet } from "./bottom-sheet";
import type { NavBadges } from "./nav";

/** Las 4 secciones de uso diario; el resto vive en «Más». */
const PRIMARY: { key: ModuleKey; label: string }[] = [
  { key: "resumen", label: "Resumen" },
  { key: "crm", label: "CRM" },
  { key: "presupuestos", label: "Presupuestos" },
  { key: "redes", label: "Redes" },
];

const THEMES = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

const isActive = (href: string, pathname: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/**
 * Barra de pestañas inferior (solo móvil), como en una app nativa: siempre a mano del
 * pulgar, con la sección activa resaltada y un indicador que se desliza entre pestañas.
 */
export function TabBar({ badges, name, email }: { badges: NavBadges; name?: string | null; email?: string }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const theme = useSyncExternalStore(subscribePreference, readPreference, () => "system" as const);
  const signOutRef = useRef<HTMLFormElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Cerrar «Más» al navegar: ajuste de estado durante el render
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMoreOpen(false);
  }

  const primaryActive = PRIMARY.find((p) => isActive(getModule(p.key).href, pathname))?.key;
  const activeKey = moreOpen ? "mas" : (primaryActive ?? "mas");
  const secondary = modules.filter((m) => !PRIMARY.some((p) => p.key === m.key));
  const moreBadge = secondary.reduce((s, m) => s + (badges[m.key] ?? 0), 0);

  // Indicador deslizante detrás del icono activo
  useLayoutEffect(() => {
    const bar = barRef.current;
    const pill = pillRef.current;
    if (!bar || !pill) return;
    const place = () => {
      const el = bar.querySelector<HTMLElement>(`[data-tab="${activeKey}"] [data-icon]`);
      if (!el) return;
      const b = bar.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      pill.style.opacity = "1";
      pill.style.transform = `translateX(${r.left - b.left}px)`;
    };
    place();
    requestAnimationFrame(() => (bar.dataset.ready = "true"));
    // Recolocar al girar el teléfono o cambiar el tamaño
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeKey]);

  const displayName = name?.trim() || "Administrador";

  return (
    <>
      <nav
        ref={barRef}
        aria-label="Secciones"
        className="group/tabs fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 pb-safe backdrop-blur-xl select-none md:hidden print:hidden"
      >
        <span
          ref={pillRef}
          aria-hidden
          className="pointer-events-none absolute top-2 left-0 h-8 w-14 rounded-full bg-primary/15 opacity-0 group-data-[ready=true]/tabs:transition-transform group-data-[ready=true]/tabs:duration-500 group-data-[ready=true]/tabs:ease-out-expo"
        />
        <ul className="relative grid grid-cols-5">
          {PRIMARY.map((p) => {
            const m = getModule(p.key);
            const on = activeKey === p.key;
            const Icon = m.icon;
            return (
              <li key={p.key} data-tab={p.key}>
                <Link
                  href={m.href}
                  aria-current={primaryActive === p.key ? "page" : undefined}
                  className={cn(
                    "pressable flex h-16 flex-col items-center justify-start gap-1 pt-2 text-[10px] font-medium tracking-tight transition-colors",
                    on ? "text-brand" : "text-muted-foreground",
                  )}
                >
                  <span data-icon className="inline-flex h-8 w-14 items-center justify-center">
                    <Icon aria-hidden className={cn("size-5 transition-transform duration-300", on && "scale-110")} strokeWidth={on ? 2.25 : 2} />
                  </span>
                  <span className="max-w-full truncate">{p.label}</span>
                </Link>
              </li>
            );
          })}
          <li data-tab="mas">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                "pressable flex h-16 w-full flex-col items-center justify-start gap-1 pt-2 text-[10px] font-medium tracking-tight transition-colors",
                activeKey === "mas" ? "text-brand" : "text-muted-foreground",
              )}
            >
              <span data-icon className="relative inline-flex h-8 w-14 items-center justify-center">
                <Ellipsis aria-hidden className="size-5" />
                {moreBadge > 0 && <span className="absolute top-1 right-3 size-2 rounded-full bg-primary ring-2 ring-background" />}
              </span>
              Más
              {moreBadge > 0 && <span className="sr-only">({moreBadge} sin leer)</span>}
            </button>
          </li>
        </ul>
      </nav>

      <BottomSheet open={moreOpen} onOpenChange={setMoreOpen} title="Más">
        {/* Resto de secciones como mosaicos grandes, fáciles de tocar */}
        <ul className="grid grid-cols-3 gap-2.5">
          {secondary.map((m) => {
            const Icon = m.icon;
            const count = badges[m.key] ?? 0;
            const on = isActive(m.href, pathname);
            return (
              <li key={m.key}>
                <Link
                  href={m.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "pressable relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border p-2 text-center text-xs font-medium",
                    on ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-full",
                      on ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="leading-tight">{m.label}</span>
                  {count > 0 && (
                    <span className="absolute top-2 right-2 min-w-5 rounded-full bg-primary px-1.5 text-[10px] leading-5 font-semibold text-primary-foreground tabular-nums">
                      {count > 99 ? "99+" : count}
                      <span className="sr-only"> sin leer</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tema */}
        <p className="mt-6 mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">Tema</p>
        <div role="radiogroup" aria-label="Tema" className="grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const on = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => applyPreference(value as ThemePreference)}
                className={cn(
                  "pressable flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-colors",
                  on ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Cuenta */}
        <p className="mt-6 mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">Cuenta</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <Link href="/ajustes" className="flex items-center gap-3 px-4 py-3 active:bg-accent">
            <span
              aria-hidden
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base text-primary-foreground"
            >
              {displayName[0].toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            </span>
            <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
          </Link>
          <a
            href="https://juantapias.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center gap-3 px-4 text-sm active:bg-accent"
          >
            <ExternalLink aria-hidden className="size-4 text-muted-foreground" />
            <span className="flex-1">Ver sitio web</span>
          </a>
          <button
            type="button"
            onClick={() => signOutRef.current?.requestSubmit()}
            className="flex min-h-12 w-full items-center gap-3 px-4 text-left text-sm text-destructive active:bg-destructive/10"
          >
            <LogOut aria-hidden className="size-4" />
            Cerrar sesión
          </button>
        </div>
        <form ref={signOutRef} action="/auth/signout" method="post" hidden />
      </BottomSheet>
    </>
  );
}
