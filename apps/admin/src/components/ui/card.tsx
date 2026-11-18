import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoTip } from "./info-tip";
import { ArrowRight } from "lucide-react";

/** Superficie base del admin: borde fino, radio amplio y un brillo superior de 1px. */
export const surfaceClass =
  "min-w-0 rounded-2xl border border-border bg-card text-card-foreground shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_5%,transparent)]";

export function IconChip({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-4" />
    </span>
  );
}

export function Card({
  title,
  icon,
  info,
  action,
  children,
  className = "",
}: {
  title?: string;
  icon?: LucideIcon;
  /** Explicación breve del contenido (se muestra en un tooltip junto al título) */
  info?: string;
  /** Enlace o control en la esquina superior derecha (p. ej. «Ver todo») */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(surfaceClass, "p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="flex min-w-0 items-center gap-2.5 text-sm font-medium">
              {icon && <IconChip icon={icon} />}
              <span className="truncate">{title}</span>
              {info && <InfoTip label={title}>{info}</InfoTip>}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Enlace secundario para la cabecera de una tarjeta. */
export function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    >
      {children}
      <ArrowRight aria-hidden className="size-3" />
    </Link>
  );
}

/**
 * KPI: etiqueta con icono, cifra grande y una línea de contexto (variación o pista).
 * `highlight` la marca como métrica principal (brillo naranja); `href` la vuelve un enlace.
 */
export function Stat({
  label,
  value,
  hint,
  icon,
  info,
  href,
  highlight = false,
  children,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  info?: string;
  href?: string;
  highlight?: boolean;
  /** Contenido extra bajo la cifra (p. ej. un <Delta />) */
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        surfaceClass,
        "relative p-4 sm:p-5",
        href && "pressable",
        highlight && "glow-brand border-primary/25",
        href &&
          "transition-[border-color,transform] duration-300 ease-out-expo has-[>a:hover]:-translate-y-0.5 has-[>a:hover]:border-ring/40 has-[>a:focus-visible]:outline-2 has-[>a:focus-visible]:outline-offset-2 has-[>a:focus-visible]:outline-ring",
      )}
    >
      {/* Enlace estirado: cubre la tarjeta sin anidar el botón del tooltip dentro de <a> */}
      {href && <Link href={href} aria-label={`${label}: ${value}`} className="absolute inset-0 rounded-2xl outline-none" />}
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          {icon && <IconChip icon={icon} className={cn("size-7 sm:size-8", highlight && "border-primary/30 bg-primary/10 text-brand")} />}
          <span className="line-clamp-2 leading-tight">{label}</span>
        </p>
        {info && (
          <span className="relative z-10">
            <InfoTip label={label}>{info}</InfoTip>
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-medium tracking-tight break-words tabular-nums sm:mt-4 sm:text-3xl">{value}</p>
      {children && <div className="mt-2">{children}</div>}
      {hint && <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">{hint}</p>}
    </section>
  );
}
