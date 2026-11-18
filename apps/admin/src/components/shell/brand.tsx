import Link from "next/link";

/** Marca del admin: monograma + nombre en la serif de la web. `compact` deja solo el monograma. */
export function Brand({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={compact ? "Tapias Admin: ir al resumen" : undefined}
      className="flex items-center gap-2.5 rounded-full px-1.5 py-1 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span
        aria-hidden
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground font-heading text-lg text-background"
      >
        T
      </span>
      {!compact && (
        <span className="leading-none whitespace-nowrap">
          <span className="block font-heading text-lg">Tapias</span>
          <span className="block text-[10px] font-medium tracking-[0.18em] text-brand uppercase">Admin</span>
        </span>
      )}
    </Link>
  );
}
