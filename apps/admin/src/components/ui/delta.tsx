import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/** Variación contra el periodo anterior. `inverse` para métricas donde bajar es mejor (posición en Google). */
export function Delta({ current, previous, inverse = false }: { current: number; previous: number; inverse?: boolean }) {
  if (!previous) return <span className="text-xs text-muted-foreground">sin periodo anterior</span>;
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return <span className="text-xs text-muted-foreground">= vs. periodo anterior</span>;
  const good = inverse ? change < 0 : change > 0;
  const Arrow = change > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs">
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums ${
          good ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive"
        }`}
      >
        <Arrow aria-hidden className="size-3" />
        <span className="sr-only">{change > 0 ? "Sube" : "Baja"}</span>
        {Math.abs(change * 100).toFixed(0)}%
      </span>
      <span className="sr-only text-muted-foreground sm:not-sr-only">vs. periodo anterior</span>
    </span>
  );
}
