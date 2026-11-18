"use client";

import { useActionState, useEffect, useRef } from "react";
import { addActivity, type FormState } from "../actions";
import { Button, FormError, Select, Textarea } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { ACTIVITY_TYPES } from "@/lib/crm";

export function ActivityForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addActivity, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="lead_id" value={leadId} />
      <Textarea name="content" rows={2} placeholder="Qué pasó, qué quedó pendiente…" required />
      <div className="flex flex-wrap items-center gap-2">
        <Select name="type" defaultValue="nota" className="w-auto" aria-label="Tipo">
          {ACTIVITY_TYPES.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Seguimiento
          <DatePicker name="next_follow_up" placeholder="Sin fecha" presets className="w-52" aria-label="Seguimiento" />
        </label>
        <Button disabled={pending} className="ml-auto">{pending ? "Guardando…" : "Añadir"}</Button>
      </div>
      <FormError message={state.error} />
    </form>
  );
}
