"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modules } from "@/lib/modules";

export function Sidebar() {
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
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
