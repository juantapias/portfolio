/** Variación contra el periodo anterior. `inverse` para métricas donde bajar es mejor (posición en Google). */
export function Delta({ current, previous, inverse = false }: { current: number; previous: number; inverse?: boolean }) {
  if (!previous) return <span className="text-xs text-muted">sin periodo anterior</span>;
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return <span className="text-xs text-muted">= vs. periodo anterior</span>;
  const good = inverse ? change < 0 : change > 0;
  return (
    <span className={`text-xs font-medium ${good ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
      <span aria-hidden>{change > 0 ? "▲" : "▼"}</span> {Math.abs(change * 100).toFixed(0)}%
      <span className="font-normal text-muted"> vs. periodo anterior</span>
    </span>
  );
}
