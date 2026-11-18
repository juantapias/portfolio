"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { applyPreference, readPreference, subscribePreference, type ThemePreference } from "@/lib/theme";
import { headerButton } from "./header-button";

const THEMES = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

/** Botón de tema: el icono refleja la preferencia actual (claro, oscuro o la del sistema). */
export function ThemeMenu() {
  // La preferencia vive en localStorage; en el servidor se asume «Sistema»
  const theme = useSyncExternalStore(subscribePreference, readPreference, () => "system" as const);
  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger className={headerButton} aria-label={`Tema: ${current.label}`}>
            <Icon className="size-4" />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Tema</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Tema</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => applyPreference(v as ThemePreference)}>
          {THEMES.map(({ value, label, icon: ItemIcon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <ItemIcon aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
