"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveLead, type FormState } from "./actions";
import { Button, Field, FormError, Input, Select, Textarea, buttonClass } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/crm";
import { CURRENCIES } from "@/lib/quotes";
import type { Lead } from "@/lib/types";

export function LeadForm({
  lead,
  asClient = false,
  trm = null,
}: {
  lead?: Lead;
  /** Alta de un cliente ya entregado: abre en estado «Ganado» con la sección de cliente visible */
  asClient?: boolean;
  /** TRM del día (COP por 1 USD) para autocompletar la tasa del cobro en USD */
  trm?: { value: number; date: string } | null;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveLead, {});
  const [status, setStatus] = useState<string>(lead?.status ?? (asClient ? "ganado" : "nuevo"));
  const [paidCurrency, setPaidCurrency] = useState(lead?.paid_currency ?? "COP");
  const [paidFx, setPaidFx] = useState<number>(lead?.paid_fx_rate_cop ?? 1);
  const isClient = status === "ganado";

  function changePaidCurrency(next: string) {
    setPaidCurrency(next);
    if (next === "COP") setPaidFx(1);
    else if (next === "USD" && trm) setPaidFx(trm.value);
    else setPaidFx(0);
  }

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {lead && <input type="hidden" name="id" value={lead.id} />}
      {lead && <input type="hidden" name="first_contact_original" value={lead.created_at.slice(0, 10)} />}

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
          <Select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
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
        <Field
          label="Primer contacto"
          hint={lead ? undefined : "Déjalo vacío si llegó hoy. Para un cliente antiguo, pon la fecha real: así no cuenta como lead nuevo."}
        >
          <DatePicker
            name="first_contact"
            defaultValue={lead?.created_at ? lead.created_at.slice(0, 10) : null}
            placeholder="Hoy"
          />
        </Field>
        <Field label="Necesidad / mensaje" className="sm:col-span-2">
          <Textarea name="message" rows={4} defaultValue={lead?.message ?? ""} placeholder="¿Qué necesita? ¿Para cuándo?" />
        </Field>
      </fieldset>

      {isClient && (
        <fieldset className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
          <legend className="px-1 text-sm font-semibold">Cliente · proyecto entregado</legend>
          <Field label="Fecha de entrega">
            <DatePicker name="delivered_at" defaultValue={lead?.delivered_at} placeholder="Sin entregar" />
          </Field>
          <Field label="Sitio entregado">
            <Input name="delivered_url" type="url" inputMode="url" defaultValue={lead?.delivered_url ?? ""} placeholder="https://" />
          </Field>
          <Field
            label="Monto cobrado"
            className="sm:col-span-2"
            hint="Solo si no le hiciste presupuesto en el admin. Si tiene uno aceptado, cuenta ese y este se ignora."
          >
            <div className="flex flex-wrap gap-2">
              <Select
                name="paid_currency"
                value={paidCurrency}
                onChange={(e) => changePaidCurrency(e.target.value)}
                className="w-24 shrink-0"
                aria-label="Moneda del cobro"
              >
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
              <Input
                name="paid_amount"
                inputMode="decimal"
                defaultValue={lead?.paid_amount ?? ""}
                placeholder="0"
                className="min-w-32 flex-1"
                aria-label="Monto cobrado"
              />
              {paidCurrency !== "COP" && (
                <Input
                  name="paid_fx_rate_cop"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={paidFx || ""}
                  onChange={(e) => setPaidFx(Number(e.target.value))}
                  placeholder={`COP por 1 ${paidCurrency}`}
                  className="w-44"
                  aria-label={`COP por 1 ${paidCurrency}`}
                />
              )}
            </div>
          </Field>
        </fieldset>
      )}

      <FormError message={state.error} />

      <div className="flex gap-2">
        <Button disabled={pending}>{pending ? "Guardando…" : lead ? "Guardar cambios" : asClient ? "Registrar cliente" : "Crear lead"}</Button>
        <Link href={lead ? `/crm/${lead.id}` : "/crm"} className={buttonClass("ghost")}>Cancelar</Link>
      </div>
    </form>
  );
}
