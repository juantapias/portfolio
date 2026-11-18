"use client";

import { useState } from "react";
import { TemplateForm } from "./template-form";
import { deleteTemplate } from "../actions";
import { Button } from "@/components/ui/form";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { formatMoney } from "@/lib/format";
import type { ServiceTemplate } from "@/lib/types";

export function TemplateRow({ template }: { template: ServiceTemplate }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="p-4">
        <TemplateForm template={template} onDone={() => setEditing(false)} />
        <Button variant="ghost" className="mt-2" onClick={() => setEditing(false)}>Cancelar</Button>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="font-medium">{template.name}</p>
        {template.description && <p className="text-sm text-muted-foreground">{template.description}</p>}
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums">
          {template.service_template_prices.length
            ? template.service_template_prices.map((p) => <span key={p.currency}>{formatMoney(p.unit_price, p.currency)}</span>)
            : <span className="text-muted-foreground">Sin precios</span>}
        </p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" onClick={() => setEditing(true)}>Editar</Button>
        <form action={deleteTemplate}>
          <input type="hidden" name="id" value={template.id} />
          <ConfirmButton variant="danger" message={`¿Eliminar «${template.name}»? Los presupuestos existentes no cambian.`}>
            Eliminar
          </ConfirmButton>
        </form>
      </div>
    </li>
  );
}
