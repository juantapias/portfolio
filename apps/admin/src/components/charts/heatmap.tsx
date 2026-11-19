"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mapa de calor horas × días en un solo tono (secuencial: claro → oscuro).
 * Es una <table> real, así que se lee con lector de pantalla sin vista aparte;
 * al pasar el cursor o enfocar (tocar en móvil) una celda, su valor aparece arriba.
 */

// 5 escalones del color de los gráficos sobre la rejilla: el primero casi se funde con el fondo
const STEPS = [8, 28, 50, 74, 100];
const stepColor = (i: number) => `color-mix(in oklab, var(--chart) ${STEPS[i]}%, var(--chart-grid))`;

export function Heatmap({
  columns,
  rows,
  values,
  texts,
  rowLabelEvery = 3,
}: {
  /** Encabezados de columna (completo + corto) */
  columns: { label: string; short: string }[];
  /** Etiquetas de fila */
  rows: string[];
  /** values[columna][fila] */
  values: number[][];
  /** Valor ya formateado de cada celda (texts[columna][fila]); viene del servidor, sin funciones */
  texts: string[][];
  rowLabelEvery?: number;
}) {
  const [active, setActive] = useState<{ c: number; r: number } | null>(null);
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const step = (v: number) => (max === min ? 2 : Math.min(STEPS.length - 1, Math.floor(((v - min) / (max - min)) * STEPS.length)));

  return (
    <div>
      <p aria-live="polite" className="mb-3 min-h-5 text-sm">
        {active ? (
          <>
            <span className="font-medium">
              {columns[active.c].label}, {rows[active.r]}
            </span>
            <span className="text-muted-foreground"> · {texts[active.c][active.r]}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Pasa el cursor o toca una celda para ver el detalle.</span>
        )}
      </p>

      <table className="w-full table-fixed border-separate border-spacing-0.5 text-xs" onMouseLeave={() => setActive(null)}>
        <thead>
          <tr>
            <th scope="col" className="w-16">
              <span className="sr-only">Hora</span>
            </th>
            {columns.map((c) => (
              <th key={c.label} scope="col" className="pb-1 font-medium text-muted-foreground">
                <abbr title={c.label} className="no-underline">{c.short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((label, r) => (
            <tr key={label}>
              <th scope="row" className="pr-2 text-right font-normal whitespace-nowrap text-muted-foreground tabular-nums">
                <span className={cn(r % rowLabelEvery !== 0 && "sr-only")}>{label}</span>
              </th>
              {columns.map((c, ci) => {
                const v = values[ci][r];
                const on = active?.c === ci && active.r === r;
                return (
                  <td
                    key={c.label}
                    tabIndex={0}
                    onMouseEnter={() => setActive({ c: ci, r })}
                    onFocus={() => setActive({ c: ci, r })}
                    className={cn(
                      "h-4 rounded-[4px] outline-none sm:h-5",
                      on && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
                    )}
                    style={{ background: stepColor(step(v)) }}
                  >
                    <span className="sr-only">{texts[ci][r]}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground" aria-hidden>
        Menos
        {STEPS.map((_, i) => (
          <span key={i} className="size-3 rounded-[3px]" style={{ background: stepColor(i) }} />
        ))}
        Más
      </div>
    </div>
  );
}
