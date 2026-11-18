"use client";

import { useId, useMemo, useRef, useState } from "react";

export interface Point {
  date: string; // YYYY-MM-DD
  value: number;
}

const W = 720;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 40 };

const fmtDay = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", opts);

/** Escala "bonita" para el eje Y: máximo redondeado y 4 marcas */
function niceTicks(max: number) {
  if (max <= 0) return [0, 1];
  const step = 10 ** Math.floor(Math.log10(max / 4));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => s * 4 >= max) ?? step * 10;
  return Array.from({ length: 5 }, (_, i) => i * nice);
}

/**
 * Serie temporal de una sola métrica: área suave + línea de 2px, línea guía que
 * sigue el cursor y se ajusta al día más cercano, tooltip y tabla accesible.
 */
export function LineChart({ data, label, format = (v) => v.toLocaleString("es-CO") }: {
  data: Point[];
  label: string;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = useId();

  const { ticks, x, y, line, area } = useMemo(() => {
    const ticks = niceTicks(Math.max(...data.map((d) => d.value), 0));
    const top = ticks.at(-1)!;
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
    const y = (v: number) => PAD.top + ih - (v / top) * ih;
    const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`);
    const line = `M${pts.join("L")}`;
    const area = `${line}L${x(data.length - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;
    return { ticks, x, y, line, area };
  }, [data]);

  // Etiquetas del eje X: ~6 fechas repartidas; la última siempre, sin pisar a la anterior
  const xLabels = useMemo(() => {
    const every = Math.max(1, Math.ceil(data.length / 6));
    const last = data.length - 1;
    const idx = data.map((_, i) => i).filter((i) => i % every === 0);
    if (idx.at(-1) !== last) {
      if (last - idx.at(-1)! < every * 0.7) idx.pop();
      idx.push(last);
    }
    return idx.map((i) => ({ i, d: data[i] }));
  }, [data]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const iw = W - PAD.left - PAD.right;
    const i = Math.round(((px - PAD.left) / iw) * (data.length - 1));
    setHover(Math.min(Math.max(i, 0), data.length - 1));
  }

  const active = hover !== null ? data[hover] : null;

  return (
    <figure className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={`${label} por día`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h) => Math.min((h ?? -1) + 1, data.length - 1));
          if (e.key === "ArrowLeft") setHover((h) => Math.max((h ?? data.length) - 1, 0));
          if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--chart)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--chart)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rejilla y eje Y (recesivos) */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px] tabular-nums">
              {format(t)}
            </text>
          </g>
        ))}
        {xLabels.map(({ i, d }) => (
          <text
            key={d.date}
            x={x(i)}
            y={H - 8}
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
            className="fill-muted text-[11px]"
          >
            {fmtDay(d.date, { day: "numeric", month: "short" })}
          </text>
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--chart)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {active && hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={y(0)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(active.value)} r={5} fill="var(--chart)" stroke="var(--surface)" strokeWidth={2} />
          </g>
        )}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-sm"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > data.length / 2 ? "calc(-100% - 12px)" : "12px"})`,
          }}
        >
          <p className="text-base font-semibold tabular-nums">{format(active.value)}</p>
          <p className="flex items-center gap-1.5 text-muted">
            <span className="inline-block h-0.5 w-3 rounded bg-chart" aria-hidden />
            {label} · {fmtDay(active.date, { weekday: "short", day: "numeric", month: "short" })}
          </p>
        </div>
      )}

      <details className="mt-2 text-xs text-muted">
        <summary className="cursor-pointer hover:text-foreground">Ver tabla</summary>
        <table className="mt-2 w-full max-w-sm">
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-b border-border">
                <td className="py-1">{fmtDay(d.date, { weekday: "short", day: "numeric", month: "short" })}</td>
                <td className="py-1 text-right tabular-nums text-foreground">{format(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
