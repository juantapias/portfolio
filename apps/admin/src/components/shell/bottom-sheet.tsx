"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Hoja inferior al estilo iOS/Android: sube desde abajo, se cierra arrastrando hacia
 * abajo, tocando el fondo o con Escape, y bloquea el scroll de la página mientras está abierta.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; dy: number; t: number } | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  // Arrastre para cerrar: el panel sigue al dedo; si baja lo suficiente (o rápido), se cierra
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { startY: e.clientY, dy: 0, t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    panelRef.current!.style.transition = "none";
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.dy = dy;
    panelRef.current!.style.transform = `translateY(${dy}px)`;
  }
  function onPointerUp() {
    if (!drag.current) return;
    const { dy, t } = drag.current;
    const velocity = dy / Math.max(performance.now() - t, 1);
    const panel = panelRef.current!;
    panel.style.transition = "";
    panel.style.transform = "";
    drag.current = null;
    if (dy > 110 || velocity > 0.6) onOpenChange(false);
  }

  return (
    <div
      className={cn("fixed inset-0 z-50 md:hidden", open ? "visible" : "invisible")}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
    >
      <div
        className={cn("absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] border-t border-border bg-popover pb-safe text-popover-foreground shadow-2xl outline-none",
          "transition-transform duration-500 ease-out-expo",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Zona de arrastre: asa + título */}
        <div
          className="shrink-0 cursor-grab touch-none px-5 pt-2.5 pb-3 select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span aria-hidden className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-muted-foreground/30" />
          <h2 id={titleId} className="font-heading text-xl">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
