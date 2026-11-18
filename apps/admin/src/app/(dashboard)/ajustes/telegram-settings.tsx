"use client";

import { useActionState } from "react";
import { sendTestTelegram, setTelegramForType, type ActionState } from "../notificaciones/actions";
import { Button } from "@/components/ui/form";
import { Check } from "lucide-react";

export function TestTelegramButton() {
  const [state, action, pending] = useActionState<ActionState>(sendTestTelegram, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" disabled={pending}>{pending ? "Enviando…" : "Enviar prueba"}</Button>
      {state.ok && <span className="inline-flex items-center gap-1 text-sm text-success"><Check aria-hidden className="size-4" />Enviado. Revisa Telegram.</span>}
      {state.error && <span className="text-sm text-destructive">{state.error}</span>}
    </form>
  );
}

export function TypeToggle({ type, enabled, disabled }: { type: string; enabled: boolean; disabled?: boolean }) {
  return (
    <form action={setTelegramForType}>
      <input type="hidden" name="type" value={type} />
      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          name="telegram"
          defaultChecked={enabled}
          disabled={disabled}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="size-4 accent-[var(--accent)]"
        />
        Telegram
      </label>
    </form>
  );
}
