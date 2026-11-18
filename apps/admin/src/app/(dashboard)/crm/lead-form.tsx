"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveLead, type FormState } from "./actions";
import { Button, Field, FormError, Input, Select, Textarea, buttonClass } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/crm";
import { CURRENCIES } from "@/lib/quotes";
import type { Lead } from "@/lib/types";

export function LeadForm({ lead }: { lead?: Lead }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveLead, {});

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {lead && <input type="hidden" name="id" value={lead.id} />}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold">Contacto</legend>
        <Field label="Nombre *">
          <Input name="name" required defaultValue={lead?.name} autoFocus={!lead} />
        </Field>
        <Field label="Empresa">
          <Input name="company" defaultValue={lead?.company ?? ""} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={lead?.email ?? ""} />
        </Field>
        <Field label="Teléfono / WhatsApp">
          <Input name="phone" type="tel" defaultValue={lead?.phone ?? ""} placeholder="+57 300 000 0000" />
        </Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold">Oportunidad</legend>
        <Field label="Estado">
          <Select name="status" defaultValue={lead?.status ?? "nuevo"}>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Origen">
          <Select name="source" defaultValue={lead?.source ?? ""}>
            <option value="">—</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Valor estimado">
          <div className="flex gap-2">
            <Select name="currency" defaultValue={lead?.currency ?? "COP"} className="w-24 shrink-0">
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Input name="estimated_value" inputMode="decimal" defaultValue={lead?.estimated_value ?? ""} placeholder="0" />
          </div>
        </Field>
        <Field label="Próximo seguimiento">
          <DatePicker name="next_follow_up" defaultValue={lead?.next_follow_up} placeholder="Sin seguimiento" presets />
        </Field>
        <Field label="Necesidad / mensaje" className="sm:col-span-2">
          <Textarea name="message" rows={4} defaultValue={lead?.message ?? ""} placeholder="¿Qué necesita? ¿Para cuándo?" />
        </Field>
      </fieldset>

      <FormError message={state.error} />

      <div className="flex gap-2">
        <Button disabled={pending}>{pending ? "Guardando…" : lead ? "Guardar cambios" : "Crear lead"}</Button>
        <Link href={lead ? `/crm/${lead.id}` : "/crm"} className={buttonClass("ghost")}>Cancelar</Link>
      </div>
    </form>
  );
}
