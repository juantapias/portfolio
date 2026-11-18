import type { QuoteStatus } from "./types";
import type { Tone } from "./crm";
import { todayISO } from "./format";

export const CURRENCIES = ["COP", "USD", "EUR", "MXN", "CAD", "GBP"] as const;

export const QUOTE_STATUSES: { value: QuoteStatus; label: string; tone: Tone }[] = [
  { value: "borrador", label: "Borrador", tone: "neutral" },
  { value: "enviado", label: "Enviado", tone: "blue" },
  { value: "aceptado", label: "Aceptado", tone: "green" },
  { value: "rechazado", label: "Rechazado", tone: "red" },
  { value: "vencido", label: "Vencido", tone: "amber" },
];

/** Un presupuesto enviado cuya fecha de validez ya pasó se muestra como vencido. */
export function effectiveQuoteStatus(status: QuoteStatus, validUntil: string): QuoteStatus {
  return status === "enviado" && validUntil < todayISO() ? "vencido" : status;
}

export function quoteStatus(value: QuoteStatus) {
  return QUOTE_STATUSES.find((s) => s.value === value)!;
}

export function computeTotals(
  items: { quantity: number; unit_price: number }[],
  discount: number,
  taxRate: number,
) {
  const subtotal = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0);
  const base = Math.max(subtotal - (Number(discount) || 0), 0);
  const tax = (base * (Number(taxRate) || 0)) / 100;
  return { subtotal, tax, total: base + tax };
}
