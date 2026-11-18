"use client";

import { useRef } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ExternalLink, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Perfil en el header: avatar + nombre, con accesos de cuenta y cerrar sesión. */
export function UserMenu({ name, email }: { name?: string | null; email?: string }) {
  const signOutRef = useRef<HTMLFormElement>(null);
  const displayName = name?.trim() || "Administrador";
  const initial = displayName[0].toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Cuenta: ${displayName}`}
          className="flex h-10 items-center gap-2 rounded-full border border-border bg-card p-1 transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/40 data-[state=open]:bg-accent sm:pr-3"
        >
          <span
            aria-hidden
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base text-primary-foreground"
          >
            {initial}
          </span>
          <span className="hidden max-w-36 truncate text-sm font-medium sm:block">{displayName}</span>
          <ChevronDown aria-hidden className="hidden size-4 text-muted-foreground sm:block" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl p-1.5">
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
            <span
              aria-hidden
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg text-primary-foreground"
            >
              {initial}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/ajustes">
                <Settings aria-hidden />
                Perfil y ajustes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notificaciones">
                <Bell aria-hidden />
                Notificaciones
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="https://juantapias.dev" target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden />
              Ver sitio web
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => signOutRef.current?.requestSubmit()}>
            <LogOut aria-hidden />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <form ref={signOutRef} action="/auth/signout" method="post" hidden />
    </>
  );
}
