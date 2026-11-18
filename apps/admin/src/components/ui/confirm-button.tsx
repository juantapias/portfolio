"use client";

import { Button } from "./form";
import type { ComponentProps } from "react";

/** Botón de submit que pide confirmación antes de enviar el formulario. */
export function ConfirmButton({
  message,
  ...props
}: ComponentProps<typeof Button> & { message: string }) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    />
  );
}
