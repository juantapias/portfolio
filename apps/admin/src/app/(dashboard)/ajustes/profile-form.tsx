"use client";

import { useActionState } from "react";
import { saveProfile, type FormState } from "./actions";
import { Button, Field, FormError, Input, Select, Textarea } from "@/components/ui/form";
import type { BusinessProfile } from "@/lib/types";
import { Check } from "lucide-react";

export function ProfileForm({ profile }: { profile: BusinessProfile | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, {});

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre legal *" hint="Como aparece en tu documento / RUT">
          <Input name="legal_name" required defaultValue={profile?.legal_name} />
        </Field>
        <Field label="Nombre comercial" hint="Encabeza el presupuesto si lo llenas">
          <Input name="trade_name" defaultValue={profile?.trade_name ?? ""} placeholder="Tapias" />
        </Field>
        <Field label="Documento *">
          <div className="flex gap-2">
            <Select name="document_type" defaultValue={profile?.document_type ?? "CC"} className="w-24 shrink-0">
              <option>CC</option>
              <option>NIT</option>
              <option>CE</option>
              <option>PP</option>
            </Select>
            <Input name="document_number" required defaultValue={profile?.document_number} />
          </div>
        </Field>
        <Field label="Régimen tributario">
          <Input name="tax_regime" defaultValue={profile?.tax_regime ?? "No responsable de IVA"} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={profile?.email ?? ""} />
        </Field>
        <Field label="Teléfono">
          <Input name="phone" defaultValue={profile?.phone ?? ""} />
        </Field>
        <Field label="Ciudad">
          <Input name="city" defaultValue={profile?.city ?? ""} placeholder="Medellín, Colombia" />
        </Field>
        <Field label="Sitio web">
          <Input name="website" defaultValue={profile?.website ?? "juantapias.dev"} />
        </Field>
        <Field label="Medios de pago" hint="Sale en todos los presupuestos" className="sm:col-span-2">
          <Textarea
            name="payment_methods"
            rows={3}
            defaultValue={profile?.payment_methods ?? ""}
            placeholder={"Bancolombia ahorros 000-000000-00 (COP)\nWise / Payoneer para USD y EUR"}
          />
        </Field>
        <Field label="Condiciones de pago por defecto" className="sm:col-span-2">
          <Textarea name="default_payment_terms" rows={2} defaultValue={profile?.default_payment_terms ?? "50% de anticipo para iniciar y 50% contra entrega."} />
        </Field>
      </div>
      <FormError message={state.error} />
      <div className="flex items-center gap-3">
        <Button disabled={pending}>{pending ? "Guardando…" : "Guardar perfil"}</Button>
        {state.ok && !pending && <span className="inline-flex items-center gap-1 text-sm text-success"><Check aria-hidden className="size-4" />Guardado</span>}
      </div>
    </form>
  );
}
