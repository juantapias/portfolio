import type { LucideIcon } from "lucide-react";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { surfaceClass } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, ChartSkeleton, LoadingRegion, MediaGridSkeleton, StatGridSkeleton } from "@/components/skeletons";
import { InfoTip } from "@/components/ui/info-tip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// La API de Instagram limita las estadísticas de cuenta a ventanas de 30 días
export const RANGES = [7, 28] as const;
export type Range = (typeof RANGES)[number];

export const TABS = ["general", "instagram", "tiktok", "horarios"] as const;
export type Tab = (typeof TABS)[number];

export const n = (v: number) => v.toLocaleString("es-CO");

/** Cabecera de una red: avatar, nombre, @usuario enlazado y datos de la cuenta. */
export function ProfileHeader({
  network,
  icon: Icon,
  avatar,
  handle,
  href,
  meta,
  action,
}: {
  network: string;
  icon: LucideIcon;
  avatar?: string | null;
  handle: string;
  href: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative shrink-0">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" referrerPolicy="no-referrer" className="size-11 rounded-full border border-border object-cover" />
          ) : (
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="size-5" />
            </span>
          )}
          <span
            aria-hidden
            className="absolute -right-1 -bottom-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card"
          >
            <Icon className="size-3" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="font-medium">{network}</p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-1 truncate text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            {handle}
            {meta && <span className="text-muted-foreground/70">· {meta}</span>}
            <ExternalLink aria-hidden className="size-3.5 shrink-0" />
            <span className="sr-only">(abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
      {action}
    </div>
  );
}

/** Métrica secundaria compacta: icono, etiqueta, cifra y variación opcional. */
export function MiniStat({
  icon: Icon,
  label,
  value,
  info,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  info?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(surfaceClass, "flex items-start gap-3 p-4")}>
      <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{label}</span>
          {info && <InfoTip label={label}>{info}</InfoTip>}
        </p>
        <p className="mt-0.5 text-lg font-medium tabular-nums">{value}</p>
        {children && <div className="mt-1">{children}</div>}
      </div>
    </div>
  );
}

/** Cifra de una publicación: icono + valor, con el nombre en tooltip y para lectores de pantalla. */
export function MediaMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: number }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div tabIndex={0} className="flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <dt>
            <Icon aria-hidden className="size-3.5 text-muted-foreground" />
            <span className="sr-only">{label}</span>
          </dt>
          <dd className="font-medium tabular-nums">{value == null ? "—" : n(value)}</dd>
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Aviso destacado dentro de una sección (p. ej. «no has publicado en X días»). */
export function Callout({
  icon: Icon,
  tone = "warning",
  children,
}: {
  icon: LucideIcon;
  tone?: "warning" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl px-3.5 py-3 text-sm",
        tone === "warning" ? "bg-warning/10 text-foreground" : "bg-info/10 text-foreground",
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", tone === "warning" ? "text-warning" : "text-info")} />
      <div>{children}</div>
    </div>
  );
}

export function SectionError({ reason }: { reason: unknown }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>No se pudo cargar: {reason instanceof Error ? reason.message : String(reason)}</span>
    </p>
  );
}

/** Esqueleto mientras cargan las APIs (Instagram y TikTok pueden tardar varios segundos). */
export function TabSkeleton() {
  return (
    <LoadingRegion label="Cargando métricas" className="space-y-4">
      <div className={cn(surfaceClass, "flex items-center gap-3 p-4")}>
        <Skeleton className="size-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-3 w-44 rounded-full" />
        </div>
      </div>
      <StatGridSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        <CardSkeleton>
          <ChartSkeleton bars={14} />
        </CardSkeleton>
        <CardSkeleton>
          <ChartSkeleton bars={14} />
        </CardSkeleton>
      </div>
      <CardSkeleton>
        <MediaGridSkeleton />
      </CardSkeleton>
    </LoadingRegion>
  );
}
