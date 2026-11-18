"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface Column {
  label: string;
  value: number;
  /** Texto del tooltip (p. ej. el rango de fechas completo) */
  detail?: string;
}

/** Escala "bonita" para el eje Y: máximo redondeado y 4 marcas */
function niceTicks(max: number) {
  if (max <= 0) return [0, 1, 2, 3, 4];
  const step = 10 ** Math.floor(Math.log10(max / 4));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => s * 4 >= max) ?? step * 10;
  const unit = Math.max(nice, 1);
  return Array.from({ length: 5 }, (_, i) => i * unit);
}

/**
 * Columnas verticales para comparar periodos. Las columnas son rayadas (recesivas)
 * salvo `highlight`, en naranja sólido con su valor encima: el ojo va directo al
 * periodo actual. Cada columna es enfocable y muestra su valor exacto en un tooltip.
 */
export function ColumnChart({
  data,
  label,
  highlight = data.length - 1,
  format = (v) => v.toLocaleString("es-CO"),
  height = 200,
}: {
  data: Column[];
  label: string;
  highlight?: number;
  format?: (v: number) => string;
  height?: number;
}) {
  const ticks = niceTicks(Math.max(...data.map((d) => d.value), 0));
  const top = ticks.at(-1)!;

  return (
    <figure>
      <div className="flex gap-3">
        {/* Eje Y */}
        <div aria-hidden className="relative w-6 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums" style={{ height }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%` }}>
              {format(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Rejilla */}
          <div aria-hidden className="absolute inset-x-0 top-0" style={{ height }}>
            {ticks.map((t) => (
              <span
                key={t}
                className={cn("absolute inset-x-0 border-t", t === 0 ? "border-border" : "border-dashed border-chart-grid")}
                style={{ bottom: `${(t / top) * 100}%` }}
              />
            ))}
          </div>

          <ul className="relative flex items-end gap-2 sm:gap-3" style={{ height }} aria-label={label}>
            {data.map((d, i) => {
              const active = i === highlight;
              const pct = top ? (d.value / top) * 100 : 0;
              return (
                <li key={d.label} className="flex h-full flex-1 flex-col justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        aria-label={`${d.detail ?? d.label}: ${format(d.value)}`}
                        className={cn(
                          "group relative w-full rounded-t-xl rounded-b-md transition-[height,background-color] duration-500 ease-out-expo outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                          active
                            ? "bg-primary"
                            : "bg-hatch border border-border bg-muted/60 hover:border-ring/50",
                        )}
                        style={{ height: `max(${pct}%, 6px)` }}
                      >
                        {active && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-2 py-0.5 text-xs font-medium whitespace-nowrap text-background tabular-nums">
                            {format(d.value)}
                          </span>
                        )}
                        {/* Marca superior, como en las referencias */}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute top-2 left-1/2 h-1 w-1/3 max-w-6 -translate-x-1/2 rounded-full",
                            active ? "bg-primary-foreground/70" : "bg-foreground/30",
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-medium tabular-nums">{format(d.value)}</span>
                      <span className="opacity-70">· {d.detail ?? d.label}</span>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>

          {/* Eje X */}
          <div aria-hidden className="mt-2 flex gap-2 sm:gap-3">
            {data.map((d, i) => (
              <span
                key={d.label}
                className={cn(
                  "flex-1 truncate text-center text-[11px]",
                  i === highlight ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
