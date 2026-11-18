import { surfaceClass } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Esqueletos que replican la forma de los componentes reales (Stat, Card, gráficas,
 * listas, tablas…): la página no «salta» cuando llega el contenido.
 */

/** Contenedor de una vista en carga: la anuncia a lectores de pantalla y aparece con un breve retraso. */
export function LoadingRegion({ label = "Cargando", className, children }: { label?: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("loading-fade", className)}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

export function PageHeaderSkeleton({
  eyebrow = false,
  description = true,
  actions = 0,
  back = false,
  aside,
}: {
  eyebrow?: boolean;
  description?: boolean;
  /** Número de botones a la derecha */
  actions?: number;
  /** Enlace «volver» encima del título */
  back?: boolean;
  /** Contenido a la derecha en lugar de botones (p. ej. un selector de periodo) */
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && <Skeleton className="mb-4 h-4 w-28 rounded-full" />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <Skeleton className="mb-3 h-3 w-28 rounded-full" />}
          <Skeleton className="h-9 w-56 rounded-lg md:h-10" />
          {description && <Skeleton className="mt-3 h-4 w-80 max-w-full rounded-full" />}
        </div>
        {aside}
        {actions > 0 && (
          <div className="flex gap-2">
            {Array.from({ length: actions }, (_, i) => (
              <Skeleton key={i} className={cn("h-9 rounded-full", i === actions - 1 ? "w-36" : "w-24")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Igual que <Stat>: icono + etiqueta, cifra grande y una línea de contexto. */
export function StatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(surfaceClass, "p-5", className)}>
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-3.5 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-28 rounded-lg" />
      <Skeleton className="mt-3 h-3 w-36 rounded-full" />
    </div>
  );
}

export function StatGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  const cols = count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4";
  return (
    <div className={cn("grid gap-4", cols, className)}>
      {Array.from({ length: count }, (_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
  );
}

/** Igual que <Card>: cabecera (icono + título y enlace opcional) y el contenido que se le pase. */
export function CardSkeleton({
  action = false,
  className,
  children,
}: {
  action?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(surfaceClass, "p-5", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        {action && <Skeleton className="h-6 w-20 rounded-full" />}
      </div>
      {children}
    </div>
  );
}

/** Área de gráfica: rejilla tenue y una serie de barras (sirve para líneas y columnas). */
export function ChartSkeleton({ height = 200, bars = 12 }: { height?: number; bars?: number }) {
  // Alturas fijas (no aleatorias) para que servidor y cliente pinten lo mismo
  const heights = [38, 55, 42, 70, 48, 62, 35, 78, 58, 66, 45, 82, 52, 60];
  return (
    <div className="relative" style={{ height }}>
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="border-t border-dashed border-chart-grid" />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-2">
        {Array.from({ length: bars }, (_, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-lg rounded-b-sm" style={{ height: `${heights[i % heights.length]}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Igual que <BarList>: etiqueta + valor y una barra fina por fila. */
export function BarListSkeleton({ rows = 5 }: { rows?: number }) {
  const widths = [92, 74, 58, 41, 30, 22, 16];
  return (
    <ul className="space-y-3.5">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i}>
          <div className="mb-1.5 flex justify-between gap-3">
            <Skeleton className="h-3.5 rounded-full" style={{ width: `${30 + ((i * 17) % 35)}%` }} />
            <Skeleton className="h-3.5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-1.5 rounded-full" style={{ width: `${widths[i % widths.length]}%` }} />
        </li>
      ))}
    </ul>
  );
}

/** Filas de lista con avatar/icono, dos líneas de texto y un dato a la derecha. */
export function ListSkeleton({ rows = 5, avatar = true }: { rows?: number; avatar?: boolean }) {
  return (
    <ul className="space-y-1">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {avatar && <Skeleton className="size-8 shrink-0 rounded-full" />}
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 rounded-full" style={{ width: `${45 + ((i * 13) % 30)}%` }} />
              <Skeleton className="h-3 rounded-full" style={{ width: `${25 + ((i * 11) % 20)}%` }} />
            </div>
          </div>
          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

/** Tabla: cabecera y filas con columnas de ancho estable. */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className={cn(surfaceClass, "overflow-hidden")}>
      <div className="flex gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: cols }, (_, c) => (
          <Skeleton key={c} className={cn("h-3 rounded-full", c === 0 ? "w-20" : "flex-1")} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton
              key={c}
              className={cn("h-3.5 rounded-full", c === 0 ? "w-20" : c === 1 ? "flex-[2]" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Formulario: secciones con etiqueta + control, en dos columnas, y botones al final. */
export function FormSkeleton({ fields = 8, textareas = 1, className }: { fields?: number; textareas?: number; className?: string }) {
  return (
    <div className={cn("max-w-3xl space-y-6", className)}>
      <Skeleton className="h-4 w-24 rounded-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3.5 w-28 rounded-full" />
            <Skeleton className="h-9 rounded-xl" />
          </div>
        ))}
        {Array.from({ length: textareas }, (_, i) => (
          <div key={`t${i}`} className="space-y-2 sm:col-span-2">
            <Skeleton className="h-3.5 w-40 rounded-full" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

/** Pestañas segmentadas (como <SegmentedNav>). */
export function SegmentedSkeleton({ items = 3, small = false, className }: { items?: number; small?: boolean; className?: string }) {
  return (
    <div className={cn("inline-flex gap-1 rounded-full border border-border bg-card p-1", className)}>
      {Array.from({ length: items }, (_, i) => (
        <Skeleton key={i} className={cn("rounded-full", small ? "h-7 w-16" : "h-8 w-24", i === 0 && "bg-foreground/15")} />
      ))}
    </div>
  );
}

/** Cuadrícula de miniaturas (publicaciones / videos). */
export function MediaGridSkeleton({ count = 4, aspect = "aspect-[4/5]" }: { count?: number; aspect?: string }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Skeleton className={cn("rounded-xl", aspect)} />
          <Skeleton className="mt-2.5 h-3 w-11/12 rounded-full" />
          <Skeleton className="mt-1.5 h-3 w-2/3 rounded-full" />
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-2.5">
            {Array.from({ length: 3 }, (_, j) => (
              <Skeleton key={j} className="h-3 rounded-full" />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Documento de presupuesto (hoja tipo A4): emisor/cliente, ítems y totales. */
export function QuoteDocumentSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-10">
      <div className="flex flex-wrap justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-3 w-56 rounded-full" />
          <Skeleton className="h-3 w-44 rounded-full" />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="ml-auto h-7 w-36 rounded-lg" />
          <Skeleton className="ml-auto h-3 w-28 rounded-full" />
          <Skeleton className="ml-auto h-3 w-32 rounded-full" />
        </div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-4 w-48 rounded-full" />
            <Skeleton className="h-3 w-36 rounded-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-10 h-3 w-full rounded-full" />
      <Skeleton className="mt-2 h-3 w-5/6 rounded-full" />
      <div className="mt-8 space-y-3 border-t border-border pt-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-3.5 flex-[3] rounded-full" />
            <Skeleton className="h-3.5 w-10 rounded-full" />
            <Skeleton className="h-3.5 w-24 rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-8 ml-auto w-56 space-y-2.5">
        <Skeleton className="h-3.5 rounded-full" />
        <Skeleton className="h-3.5 rounded-full" />
        <Skeleton className="h-6 rounded-lg" />
      </div>
    </div>
  );
}

/** Columnas del tablero del CRM. */
export function BoardSkeleton({ columns = 5 }: { columns?: number }) {
  const cards = [3, 2, 1, 2, 1];
  return (
    <div className="-mx-4 flex gap-4 overflow-hidden px-4 pb-4 md:mx-0 md:px-0">
      {Array.from({ length: columns }, (_, c) => (
        <div key={c} className="w-72 shrink-0">
          <div className="mb-3 flex items-center justify-between px-1">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-3 w-4 rounded-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: cards[c % cards.length] }, (_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
                <div className="mt-4 flex gap-3">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-3 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
