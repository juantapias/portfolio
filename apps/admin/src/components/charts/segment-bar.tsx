import type { Tone } from "@/lib/crm";
import { cn } from "@/lib/utils";

const fill: Record<Tone, string> = {
  blue: "bg-info",
  amber: "bg-warning",
  violet: "bg-violet",
  green: "bg-success",
  red: "bg-destructive",
  neutral: "bg-muted-foreground/40",
};

/**
 * Barra apilada (partes de un todo) con leyenda: cada segmento conserva su
 * etiqueta y valor visibles en la leyenda, así no depende solo del color.
 */
export function SegmentBar({
  items,
  label,
}: {
  items: { label: string; value: number; tone: Tone }[];
  label: string;
}) {
  const total = items.reduce((s, i) => s + i.value, 0);

  return (
    <div>
      <div
        role="img"
        aria-label={`${label}: ${items.map((i) => `${i.label} ${i.value}`).join(", ")}`}
        className="flex h-3 gap-1 overflow-hidden rounded-full"
      >
        {total === 0 ? (
          <span className="flex-1 rounded-full bg-muted" />
        ) : (
          items
            .filter((i) => i.value > 0)
            .map((i) => (
              <span
                key={i.label}
                className={cn("rounded-full first:rounded-l-full last:rounded-r-full", fill[i.tone])}
                style={{ flexGrow: i.value }}
              />
            ))
        )}
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className={cn("size-2.5 rounded-full", fill[i.tone])} />
              {i.label}
            </span>
            <span className="flex items-baseline gap-2 tabular-nums">
              <span className="font-medium">{i.value}</span>
              <span className="w-10 text-right text-xs text-muted-foreground">
                {total ? `${Math.round((i.value / total) * 100)}%` : "—"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
