import type { Tone } from "@/lib/crm";
import { cn } from "@/lib/utils";

/** Cada tono usa un token semántico: el texto en el color pleno y el fondo al 12%. */
const tones: Record<Tone, string> = {
  blue: "bg-info/12 text-info",
  amber: "bg-warning/12 text-warning",
  violet: "bg-violet/12 text-violet",
  green: "bg-success/12 text-success",
  red: "bg-destructive/12 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export function Badge({
  tone = "neutral",
  dot = true,
  children,
  className,
}: {
  tone?: Tone;
  /** Punto de color delante del texto: refuerza el estado sin depender solo del color de fondo */
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
