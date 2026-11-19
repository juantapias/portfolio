import type { Lead } from "./types";

/**
 * Cobros registrados a mano en la ficha del cliente.
 * Solo cuentan si ese cliente NO tiene un presupuesto aceptado en el admin
 * (si lo tiene, el monto real es el del presupuesto y así no se cuenta dos veces).
 */
export function manualRevenueCop(lead: Pick<Lead, "paid_amount" | "paid_fx_rate_cop">) {
  return lead.paid_amount ? Number(lead.paid_amount) * Number(lead.paid_fx_rate_cop ?? 1) : 0;
}

/** Clientes con cobro manual que suman en las métricas, dado el set de leads con presupuesto aceptado */
export function manualSales<T extends Pick<Lead, "id" | "status" | "paid_amount" | "delivered_at">>(
  leads: T[],
  leadsWithAcceptedQuote: Set<string>,
) {
  return leads.filter(
    (l) => l.status === "ganado" && l.paid_amount && l.delivered_at && !leadsWithAcceptedQuote.has(l.id),
  );
}
