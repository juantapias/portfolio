"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SegmentedItem {
  key: string;
  href: string;
  label: string;
  /** Icono ya renderizado (p. ej. <Camera />): los componentes no pueden pasar del servidor al cliente */
  icon?: React.ReactNode;
}

/**
 * Pestañas como enlaces (el estado vive en la URL: se puede compartir y recargar).
 * Un pill se desliza a la opción elegida en cuanto se hace clic, sin esperar a que
 * el servidor responda; luego se sincroniza con `active`.
 */
export function SegmentedNav({
  items,
  active,
  label,
  size = "md",
  className,
}: {
  items: SegmentedItem[];
  active: string;
  /** Nombre accesible del grupo (p. ej. «Red social») */
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [selected, setSelected] = useState(active);
  const [lastActive, setLastActive] = useState(active);
  if (active !== lastActive) {
    setLastActive(active);
    setSelected(active);
  }

  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const place = () => {
      const el = nav.querySelector<HTMLElement>(`[data-key="${selected}"]`);
      if (!el) return;
      pill.style.opacity = "1";
      pill.style.transform = `translateX(${el.offsetLeft}px)`;
      pill.style.width = `${el.offsetWidth}px`;
    };
    place();
    requestAnimationFrame(() => (nav.dataset.ready = "true"));
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [selected]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={cn(
        "group/seg scrollbar-none relative inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-card p-1",
        className,
      )}
    >
      <span
        ref={pillRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-foreground opacity-0 group-data-[ready=true]/seg:transition-[transform,width] group-data-[ready=true]/seg:duration-500 group-data-[ready=true]/seg:ease-out-expo"
      />
      {items.map((item) => {
        const on = item.key === selected;
        return (
          <Link
            key={item.key}
            href={item.href}
            data-key={item.key}
            scroll={false}
            onClick={() => setSelected(item.key)}
            aria-current={item.key === active ? "page" : undefined}
            className={cn(
              "relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4",
              size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-3.5 text-sm",
              on
                ? // Antes de hidratar, el fondo lo pone el propio enlace
                  "bg-foreground text-background group-data-[ready=true]/seg:bg-transparent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.icon && <span aria-hidden className="inline-flex">{item.icon}</span>}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
