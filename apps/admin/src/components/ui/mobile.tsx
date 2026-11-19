import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Patrones para móvil. Todos respetan la barra de pestañas inferior (4rem) y la
 * barra de inicio del teléfono (safe-area-inset-bottom).
 */

/** Distancia desde abajo para quedar justo encima de la barra de pestañas */
const ABOVE_TAB_BAR = "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]";

/**
 * Botón de acción flotante (FAB): la acción principal de la pantalla, siempre al
 * alcance del pulgar. Solo en móvil; en escritorio la acción vive en el encabezado.
 */
export function Fab({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link
      href={href}
      className={cn(
        "pressable fixed right-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 md:hidden print:hidden",
        ABOVE_TAB_BAR,
      )}
    >
      <Icon aria-hidden className="size-5" />
      {label}
    </Link>
  );
}

/**
 * Acciones de un formulario. En móvil quedan fijas sobre la barra de pestañas, con
 * botones a todo el ancho (y un resumen opcional, p. ej. el total); en escritorio,
 * en línea al final del formulario.
 */
export function FormActions({ summary, children }: { summary?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "sticky z-20 -mx-4 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-xl",
        ABOVE_TAB_BAR,
        "md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
      )}
    >
      {summary && <div className="mb-2.5 md:hidden">{summary}</div>}
      <div className="grid grid-cols-[1fr_auto] gap-2 md:flex md:flex-wrap [&>*:first-child]:h-11 md:[&>*:first-child]:h-9">
        {children}
      </div>
    </div>
  );
}

/** Botón «atrás» con área táctil generosa (44 px) y la flecha de iOS. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="pressable -ml-2.5 inline-flex h-10 items-center gap-0.5 rounded-full pr-3 pl-1.5 text-sm font-medium text-brand transition-colors hover:bg-accent md:text-muted-foreground md:hover:text-foreground"
    >
      <ChevronLeft aria-hidden className="size-5" />
      {label}
    </Link>
  );
}
