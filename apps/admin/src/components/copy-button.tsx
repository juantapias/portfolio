"use client";

import { useState } from "react";
import { buttonClass } from "./ui/form";

/** Copia una ruta (relativa al dominio actual) al portapapeles. */
export function CopyLinkButton({ path, label }: { path: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={buttonClass("secondary")}
      onClick={async () => {
        await navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "¡Copiado!" : label}
    </button>
  );
}
