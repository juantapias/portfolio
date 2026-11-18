"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { saveQuote, type FormState, type ItemInput } from "./actions";
import { Button, Field, FormError, Input, Select, Textarea, buttonClass } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { CURRENCIES, computeTotals } from "@/lib/quotes";
import { formatMoney } from "@/lib/format";
import type { Quote, QuoteItem, ServiceTemplate } from "@/lib/types";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface Props {
  quote?: Quote;
  items?: QuoteItem[];
  leads: { id: string; name: string; company: string | null }[];
  templates: ServiceTemplate[];
  defaultLeadId?: string;
  defaultPaymentTerms?: string | null;
  trm: { value: number; date: string } | null;
}

const newItem = (): ItemInput => ({
  id: crypto.randomUUID(),
  description: "",
  details: "",
  quantity: 1,
  unit_price: 0,
});

export function QuoteForm({ quote, items: initialItems, leads, templates, defaultLeadId, defaultPaymentTerms, trm }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveQuote, {});

  const [currency, setCurrency] = useState(quote?.currency ?? "COP");
  const [fx, setFx] = useState<number>(quote?.fx_rate_cop ?? 1);
  const [discount, setDiscount] = useState<number>(quote?.discount ?? 0);
  const [applyTax, setApplyTax] = useState((quote?.tax_rate ?? 0) > 0);
  const [taxRate, setTaxRate] = useState<number>(quote?.tax_rate || 19);
  const [items, setItems] = useState<ItemInput[]>(
    initialItems?.length
      ? initialItems.map((i) => ({ ...i, details: i.details ?? "" }))
      : [newItem()],
  );

  const totals = useMemo(
    () => computeTotals(items, discount, applyTax ? taxRate : 0),
    [items, discount, applyTax, taxRate],
  );

  function changeCurrency(next: string) {
    setCurrency(next);
    if (next === "COP") setFx(1);
    else if (next === "USD" && trm) setFx(trm.value);
    else if (next !== currency) setFx(0);
  }

  const update = (id: string, patch: Partial<ItemInput>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const move = (index: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  function addTemplate(templateId: string) {
    const t = templates.find((t) => t.id === templateId);
    if (!t) return;
    const price = t.service_template_prices.find((p) => p.currency === currency)?.unit_price ?? 0;
    const item = { ...newItem(), description: t.name, details: t.description ?? "", unit_price: Number(price) };
    setItems((prev) =>
      prev.length === 1 && !prev[0].description && !prev[0].unit_price ? [item] : [...prev, item],
    );
  }

  return (
    <form action={action} className="space-y-8">
      {quote && <input type="hidden" name="id" value={quote.id} />}
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Título *" className="sm:col-span-2">
          <Input name="title" required defaultValue={quote?.title} placeholder="Sitio web corporativo" autoFocus={!quote} />
        </Field>
        <Field label="Cliente" className="sm:col-span-2">
          <Select name="lead_id" defaultValue={quote?.lead_id ?? defaultLeadId ?? ""}>
            <option value="">Sin cliente</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}{l.company ? ` · ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Moneda">
          <Select name="currency" value={currency} onChange={(e) => changeCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field
          label={`Tasa: COP por 1 ${currency}`}
          hint={
            currency === "COP"
              ? "No aplica"
              : currency === "USD" && trm
                ? `TRM del ${trm.date}: ${trm.value.toLocaleString("es-CO")}`
                : "Para reportar en COP"
          }
        >
          <Input
            name="fx_rate_cop"
            type="number"
            step="0.0001"
            min="0"
            value={currency === "COP" ? 1 : fx || ""}
            onChange={(e) => setFx(Number(e.target.value))}
            disabled={currency === "COP"}
            required={currency !== "COP"}
          />
        </Field>
        <Field label="Fecha de emisión">
          <DatePicker name="issue_date" defaultValue={quote?.issue_date} placeholder="Hoy" />
        </Field>
        <Field label="Válido hasta" hint={quote ? undefined : "Por defecto: 15 días"}>
          <DatePicker name="valid_until" defaultValue={quote?.valid_until} placeholder="En 15 días" />
        </Field>
      </section>

      <Field label="Introducción / alcance">
        <Textarea name="intro" rows={3} defaultValue={quote?.intro ?? ""} placeholder="Contexto del proyecto y lo que incluye la propuesta." />
      </Field>

      {/* ─── Ítems ─── */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Ítems</h2>
          {templates.length > 0 && (
            <Select
              aria-label="Añadir servicio"
              value=""
              onChange={(e) => addTemplate(e.target.value)}
              className="w-auto"
            >
              <option value="">+ Añadir servicio…</option>
              {templates.map((t) => {
                const p = t.service_template_prices.find((p) => p.currency === currency);
                return (
                  <option key={t.id} value={t.id}>
                    {t.name}{p ? ` · ${formatMoney(p.unit_price, currency)}` : ` · sin precio en ${currency}`}
                  </option>
                );
              })}
            </Select>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="hidden grid-cols-[1fr_90px_160px_140px_72px] gap-3 border-b border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground md:grid">
            <span>Descripción</span>
            <span className="text-right">Cant.</span>
            <span className="text-right">Precio unitario</span>
            <span className="text-right">Importe</span>
            <span />
          </div>
          <ul className="divide-y divide-border">
            {items.map((item, index) => (
              <li key={item.id} className="grid gap-2 bg-card p-3 md:grid-cols-[1fr_90px_160px_140px_72px] md:items-start md:gap-3">
                <div className="space-y-2">
                  <Input
                    aria-label="Descripción"
                    value={item.description}
                    onChange={(e) => update(item.id, { description: e.target.value })}
                    placeholder="Diseño y desarrollo de landing page"
                  />
                  <Textarea
                    aria-label="Detalle"
                    rows={1}
                    value={item.details}
                    onChange={(e) => update(item.id, { details: e.target.value })}
                    placeholder="Detalle opcional (entregables, alcance…)"
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 md:contents">
                  <Input
                    aria-label="Cantidad"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => update(item.id, { quantity: Number(e.target.value) })}
                    className="text-right"
                  />
                  <Input
                    aria-label="Precio unitario"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price || ""}
                    onChange={(e) => update(item.id, { unit_price: Number(e.target.value) })}
                    placeholder="0"
                    className="text-right"
                  />
                </div>
                <p className="py-2 text-right text-sm tabular-nums">
                  {formatMoney(item.quantity * item.unit_price, currency)}
                </p>
                <div className="flex justify-end gap-0.5 text-muted-foreground">
                  <IconButton label="Subir" onClick={() => move(index, -1)} disabled={index === 0}><ChevronUp className="size-4" /></IconButton>
                  <IconButton label="Bajar" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ChevronDown className="size-4" /></IconButton>
                  <IconButton
                    label="Quitar"
                    onClick={() => setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== item.id) : [newItem()]))}
                  >
                    <X className="size-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Button type="button" variant="ghost" className="mt-2" onClick={() => setItems((prev) => [...prev, newItem()])}>
          + Añadir ítem
        </Button>
      </section>

      {/* ─── Totales ─── */}
      <section className="ml-auto w-full max-w-sm space-y-2 text-sm">
        <Line label="Subtotal" value={formatMoney(totals.subtotal, currency)} />
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="discount" className="text-muted-foreground">Descuento</label>
          <Input
            id="discount"
            name="discount"
            type="number"
            min="0"
            step="0.01"
            value={discount || ""}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="0"
            className="w-40 text-right"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" name="apply_tax" checked={applyTax} onChange={(e) => setApplyTax(e.target.checked)} />
            IVA
          </label>
          {applyTax ? (
            <span className="flex items-center gap-2">
              <Input
                name="tax_rate"
                type="number"
                min="0"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-20 text-right"
                aria-label="Porcentaje de IVA"
              />
              <span className="text-muted-foreground">%</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No responsable de IVA</span>
          )}
        </div>
        {applyTax && <Line label="IVA" value={formatMoney(totals.tax, currency)} />}
        <div className="border-t border-border pt-2">
          <Line label="Total" value={formatMoney(totals.total, currency)} strong />
          {currency !== "COP" && fx > 0 && (
            <p className="mt-1 text-right text-xs text-muted-foreground">≈ {formatMoney(totals.total * fx, "COP")}</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Condiciones de pago">
          <Textarea name="payment_terms" rows={3} defaultValue={quote?.payment_terms ?? defaultPaymentTerms ?? ""} />
        </Field>
        <Field label="Notas y condiciones">
          <Textarea name="notes" rows={3} defaultValue={quote?.notes ?? ""} placeholder="Tiempos de entrega, exclusiones, revisiones incluidas…" />
        </Field>
      </section>

      <FormError message={state.error} />

      <div className="flex gap-2">
        <Button disabled={pending}>{pending ? "Guardando…" : quote ? "Guardar cambios" : "Crear presupuesto"}</Button>
        <Link href={quote ? `/presupuestos/${quote.id}` : "/presupuestos"} className={buttonClass("ghost")}>Cancelar</Link>
      </div>
    </form>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-semibold" : ""}`}>
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function IconButton({ label, children, ...props }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className="flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-foreground disabled:opacity-30"
    >
      {children}
    </button>
  );
}
