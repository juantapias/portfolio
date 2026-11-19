import { surfaceClass } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarListSkeleton, CardSkeleton, LoadingRegion, StatSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";
import type { Tab } from "./shared";

/**
 * Esqueletos de cada pestaña de /redes. Replican la estructura real de cada una
 * (cabecera de perfil, KPIs, gráficas de línea, publicaciones 4:5 o videos 9:16,
 * mapa de calor y tablas por franja) para que el contenido no «salte» al llegar.
 * Sin datos aleatorios: servidor y cliente pintan lo mismo.
 */

export function TabSkeleton({ tab = "general" }: { tab?: Tab }) {
  switch (tab) {
    case "instagram":
      return <InstagramSkeleton />;
    case "tiktok":
      return <TikTokSkeleton />;
    case "horarios":
      return <ScheduleSkeleton />;
    default:
      return <OverviewSkeleton />;
  }
}

/* ---------- Piezas ---------- */

/** Igual que <ProfileHeader>: avatar con insignia de la red, nombre y @usuario · meta. */
function ProfileHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative shrink-0">
          <Skeleton className="size-11 rounded-full" />
          <span className="absolute -right-1 -bottom-1 size-5 rounded-full bg-primary/30 ring-2 ring-card" />
        </span>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-3 w-48 max-w-full rounded-full" />
        </div>
      </div>
      {action && <Skeleton className="h-7 w-24 shrink-0 rounded-full" />}
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className={cn(surfaceClass, "p-4")}>
      <ProfileHeaderSkeleton />
    </div>
  );
}

/** KPIs: el primero (seguidores) va resaltado como en <Stat highlight>. */
function KpiRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <StatSkeleton key={i} className={cn("p-4 sm:p-5", i === 0 && "border-primary/25")} />
      ))}
    </div>
  );
}

/** Igual que <MiniStat>: icono cuadrado, etiqueta, cifra y variación. */
function MiniStatSkeleton({ delta = true }: { delta?: boolean }) {
  return (
    <div className={cn(surfaceClass, "flex items-start gap-3 p-4")}>
      <Skeleton className="size-9 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-3/5 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-md" />
        {delta && <Skeleton className="h-3 w-12 rounded-full" />}
      </div>
    </div>
  );
}

/** Gráfica de línea con la misma proporción que <LineChart width={460}> (460 × 220). */
function LineChartSkeleton() {
  const pts = [62, 55, 66, 48, 52, 38, 44, 30, 41, 34, 46, 28, 36, 24];
  const step = 420 / (pts.length - 1);
  const line = pts.map((y, i) => `${30 + i * step},${y * 2.4}`).join(" ");
  return (
    <div>
      <div className="relative aspect-[460/220]">
        <div aria-hidden className="absolute inset-y-[6%] right-0 left-[7%] flex flex-col justify-between">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="border-t border-dashed border-chart-grid" />
          ))}
        </div>
        <svg aria-hidden viewBox="0 0 460 220" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <polygon points={`30,200 ${line} 450,200`} className="fill-muted/60" />
          <polyline points={line} fill="none" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" className="stroke-muted" vectorEffect="non-scaling-stroke" />
        </svg>
        <Skeleton className="absolute inset-0 bg-transparent" />
      </div>
      <Skeleton className="mt-2 h-3 w-16 rounded-full" />
    </div>
  );
}

/** Miniatura de publicación/video: insignia, cifra de vistas, texto, fecha y métricas. */
function MediaCardSkeleton({ aspect, badge, metrics }: { aspect: string; badge: boolean; metrics: number }) {
  return (
    <li className="flex flex-col">
      <div className={cn("relative overflow-hidden rounded-xl border border-border", aspect)}>
        <Skeleton className="absolute inset-0 rounded-none" />
        {badge && <span className="absolute top-2 left-2 h-5 w-14 rounded-full bg-foreground/10" />}
        <span className="absolute bottom-2 left-2.5 h-4 w-16 rounded-full bg-foreground/10" />
      </div>
      <Skeleton className="mt-2.5 h-3 w-11/12 rounded-full" />
      <Skeleton className="mt-1.5 h-3 w-2/3 rounded-full" />
      <Skeleton className="mt-2 h-2.5 w-20 rounded-full" />
      <div className="mt-2.5 grid grid-cols-3 gap-x-2 gap-y-2 border-t border-border pt-2.5">
        {Array.from({ length: metrics }, (_, j) => (
          <Skeleton key={j} className="h-3 w-4/5 rounded-full" />
        ))}
      </div>
    </li>
  );
}

function MediaGrid(props: { aspect: string; badge: boolean; metrics: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <MediaCardSkeleton key={i} {...props} />
      ))}
    </ul>
  );
}

/* ---------- Pestañas ---------- */

function OverviewSkeleton() {
  return (
    <LoadingRegion label="Cargando resumen de redes" className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className={cn(surfaceClass, "p-5")}>
            <ProfileHeaderSkeleton action />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j} className="rounded-xl bg-muted/50 p-3">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="mt-2.5 h-7 w-20 rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-14 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CardSkeleton>
          <BarListSkeleton rows={2} />
        </CardSkeleton>
        <CardSkeleton>
          <BarListSkeleton rows={2} />
        </CardSkeleton>
      </div>
    </LoadingRegion>
  );
}

function InstagramSkeleton() {
  return (
    <LoadingRegion label="Cargando métricas de Instagram" className="space-y-4">
      <ProfileCardSkeleton />
      <KpiRowSkeleton />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <MiniStatSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CardSkeleton>
          <LineChartSkeleton />
        </CardSkeleton>
        <CardSkeleton>
          <LineChartSkeleton />
        </CardSkeleton>
      </div>
      <CardSkeleton action>
        <MediaGrid aspect="aspect-[4/5]" badge metrics={6} />
      </CardSkeleton>
      <CardSkeleton>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <MiniStatSkeleton key={i} delta={false} />
          ))}
        </div>
        <Skeleton className="mt-3 h-3 w-80 max-w-full rounded-full" />
      </CardSkeleton>
    </LoadingRegion>
  );
}

function TikTokSkeleton() {
  return (
    <LoadingRegion label="Cargando métricas de TikTok" className="space-y-4">
      <ProfileCardSkeleton />
      <KpiRowSkeleton />
      <CardSkeleton>
        <MediaGrid aspect="aspect-[9/16]" badge={false} metrics={3} />
      </CardSkeleton>
    </LoadingRegion>
  );
}

// Intensidad fija de cada celda del mapa de calor (patrón suave: más actividad a media tarde y noche)
const heatLevel = (day: number, hour: number) => {
  const curve = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 3, 2, 2, 2, 3, 3, 4, 4, 4, 3, 2, 1][hour];
  return Math.max(0, Math.min(4, curve + ((day + hour) % 3 === 0 ? -1 : 0)));
};
const HEAT_OPACITY = ["opacity-30", "opacity-45", "opacity-60", "opacity-80", "opacity-100"];

function HeatmapSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="mb-3 h-4 w-72 max-w-full rounded-full" />
      <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))] gap-0.5">
        <span />
        {Array.from({ length: 7 }, (_, d) => (
          <Skeleton key={d} className="mx-auto mb-1 h-3 w-6 rounded-full" />
        ))}
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="contents">
            <span className="flex items-center justify-end pr-2">
              {h % 3 === 0 && <Skeleton className="h-2.5 w-9 rounded-full" />}
            </span>
            {Array.from({ length: 7 }, (_, d) => (
              <span key={d} className={cn("h-4 rounded-[4px] bg-muted sm:h-5", HEAT_OPACITY[heatLevel(d, h)])} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <Skeleton className="h-3 w-10 rounded-full" />
        {HEAT_OPACITY.map((o) => (
          <span key={o} className={cn("size-3 rounded-[3px] bg-muted", o)} />
        ))}
        <Skeleton className="h-3 w-8 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-3 w-40 rounded-full" />
    </div>
  );
}

/** Igual que la tabla por franja: título de la red y 4 filas (franja + 3 cifras). */
function SlotTableSkeleton() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Skeleton className="size-4 rounded-md" />
        <Skeleton className="h-3.5 w-36 rounded-full" />
      </div>
      <div className="flex gap-3 border-b border-border py-2">
        <Skeleton className="h-3 w-14 rounded-full" />
        <span className="flex-1" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 rounded-full" style={{ width: `${[38, 52, 46, 58][i]}%` }} />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-8 rounded-full" />
            <Skeleton className="h-3.5 w-14 rounded-full" />
            <Skeleton className="h-3.5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <LoadingRegion label="Cargando horarios" className="space-y-4">
      <div className={cn(surfaceClass, "p-4 md:p-5")}>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-md bg-primary/20" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-muted/60 px-3.5 py-3">
              <Skeleton className="h-3 w-14 rounded-full bg-foreground/10" />
              <Skeleton className="h-4 w-32 rounded-full bg-foreground/10" />
              <Skeleton className="h-3 w-40 max-w-full rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-info/10 px-3.5 py-3">
              <Skeleton className="size-4 shrink-0 rounded-full bg-info/25" />
              <Skeleton className={cn("h-3.5 rounded-full bg-info/20", i === 0 ? "w-3/5" : "w-4/5")} />
            </div>
          ))}
        </div>
        <Skeleton className="mt-3 h-3 w-96 max-w-full rounded-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <CardSkeleton>
          <HeatmapSkeleton />
        </CardSkeleton>
        <CardSkeleton>
          <div className="space-y-6">
            <SlotTableSkeleton />
            <SlotTableSkeleton />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-2/3 rounded-full" />
            </div>
          </div>
        </CardSkeleton>
      </div>
    </LoadingRegion>
  );
}
