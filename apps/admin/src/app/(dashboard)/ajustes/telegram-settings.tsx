"use client";

import { useActionState } from "react";
import { sendTestTelegram, setTelegramForType, type ActionState } from "../notificaciones/actions";
import { Button } from "@/components/ui/form";
import { Check } from "lucide-react";

export function TestTelegramButton() {
  const [state, action, pending] = useActionState<ActionState>(sendTestTelegram, {});
  return (
    <form action={action} className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
      <Button variant="secondary" disabled={pending} className="h-11 w-full sm:h-9 sm:w-auto">{pending ? "Enviando…" : "Enviar prueba"}</Button>
      {state.ok && <span className="inline-flex items-center gap-1 text-sm text-success"><Check aria-hidden className="size-4" />Enviado. Revisa Telegram.</span>}
      {state.error && <span className="text-sm text-destructive">{state.error}</span>}
    </form>
  );
}

/** Interruptor al estilo iOS/Android para enviar (o no) un tipo de aviso a Telegram. */
export function TypeToggle({ type, label, enabled, disabled }: { type: string; label: string; enabled: boolean; disabled?: boolean }) {
  return (
    <form action={setTelegramForType} className="shrink-0">
      <input type="hidden" name="type" value={type} />
      <label className="relative inline-flex cursor-pointer items-center p-1.5 has-disabled:cursor-not-allowed">
        <input
          type="checkbox"
          role="switch"
          name="telegram"
          defaultChecked={enabled}
          disabled={disabled}
          aria-label={`Enviar «${label}» a Telegram`}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="h-7 w-12 rounded-full bg-muted-foreground/30 transition-colors duration-200 peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40 peer-disabled:opacity-50"
        />
        <span
          aria-hidden
          className="absolute top-2 left-2 size-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out-expo peer-checked:translate-x-5 peer-disabled:opacity-80"
        />
      </label>
    </form>
  );
}
