/**
 * Lista con barras horizontales: etiqueta + valor siempre visibles (no depende
 * del hover) y una barra de magnitud en un solo tono.
 */
export function BarList({
  items,
  format = (v) => v.toLocaleString("es-CO"),
  extra,
}: {
  items: { label: string; value: number; hint?: string }[];
  format?: (v: number) => string;
  extra?: (index: number) => React.ReactNode;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  if (items.length === 0) return <p className="text-sm text-muted-foreground">Sin datos en este periodo.</p>;

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={item.label} title={`${item.label}: ${format(item.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">
              {item.label}
              {item.hint && <span className="ml-1.5 text-xs text-muted-foreground">{item.hint}</span>}
            </span>
            <span className="shrink-0 tabular-nums">
              {format(item.value)}
              {extra?.(index)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-chart-grid">
            <div className="h-full rounded-full bg-chart" style={{ width: `${Math.max((item.value / max) * 100, 1.5)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
