"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modules } from "@/lib/modules";

export function Sidebar({ badges = {} }: { badges?: Partial<Record<string, number>> }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {modules.map((m) => {
        const active =
          m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
        return (
          <Link
            key={m.key}
            href={m.href}
            className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {m.label}
            {!!badges[m.key] && (
              <span
                className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-semibold leading-5 text-white tabular-nums"
                aria-label={`${badges[m.key]} sin leer`}
              >
                {badges[m.key]! > 99 ? "99+" : badges[m.key]}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
