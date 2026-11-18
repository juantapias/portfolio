"use client";

import { buttonClass } from "./ui/form";

export function PrintButton({ label = "Descargar PDF", variant = "secondary" as const }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass(variant)}>
      {label}
    </button>
  );
}
