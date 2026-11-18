"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveTemplate, type FormState } from "../actions";
import { Button, Field, FormError, Input, Textarea } from "@/components/ui/form";
import { CURRENCIES } from "@/lib/quotes";
import type { ServiceTemplate } from "@/lib/types";

export function TemplateForm({ template, onDone }: { template?: ServiceTemplate; onDone?: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveTemplate, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (pending) submitted.current = true;
    else if (submitted.current && !state.error) {
      submitted.current = false;
      if (!template) formRef.current?.reset();
      onDone?.();
    }
  }, [pending, state, template, onDone]);

  const price = (c: string) => template?.service_template_prices.find((p) => p.currency === c)?.unit_price ?? "";

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {template && <input type="hidden" name="id" value={template.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Servicio *">
          <Input name="name" required defaultValue={template?.name} placeholder="Landing page" />
        </Field>
        <Field label="Descripción (sale como detalle del ítem)">
          <Textarea name="description" rows={1} defaultValue={template?.description ?? ""} placeholder="Diseño + desarrollo, 1 página, formulario de contacto" />
        </Field>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Precios <span className="font-normal text-muted">· deja vacío si no lo ofreces en esa moneda</span></p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {CURRENCIES.map((c) => (
            <label key={c} className="flex items-center gap-2 rounded-md border border-border bg-background pl-3 text-sm focus-within:border-accent">
              <span className="w-9 text-xs text-muted">{c}</span>
              <input
                name={`price_${c}`}
                type="number"
                min="0"
                step="0.01"
                defaultValue={price(c)}
                className="w-full min-w-0 bg-transparent py-2 pr-3 text-right outline-none"
              />
            </label>
          ))}
        </div>
      </div>
      <FormError message={state.error} />
      <Button disabled={pending}>{pending ? "Guardando…" : template ? "Guardar" : "Añadir servicio"}</Button>
    </form>
  );
}
