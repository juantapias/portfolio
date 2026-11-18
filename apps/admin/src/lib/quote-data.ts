import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuoteTotals } from "./types";

/** Totales de varios presupuestos, indexados por quote_id (la vista no se puede anidar en PostgREST). */
export async function getQuoteTotals(supabase: SupabaseClient, ids: string[]) {
  const map = new Map<string, QuoteTotals>();
  if (ids.length === 0) return map;
  const { data } = await supabase.from("quote_totals").select("*").in("quote_id", ids);
  for (const row of (data ?? []) as QuoteTotals[]) map.set(row.quote_id, row);
  return map;
}

export async function getBusinessProfile(supabase: SupabaseClient) {
  const { data } = await supabase.from("business_profile").select("*").maybeSingle();
  return data as import("./types").BusinessProfile | null;
}

/** Todo lo necesario para pintar un presupuesto. */
export async function getQuoteBundle(supabase: SupabaseClient, by: { id: string } | { token: string }) {
  const query = supabase.from("quotes").select("*");
  const { data: quote } = await ("id" in by ? query.eq("id", by.id) : query.eq("public_token", by.token)).maybeSingle();
  if (!quote) return null;

  const [{ data: items }, totals, profile, { data: client }] = await Promise.all([
    supabase.from("quote_items").select("*").eq("quote_id", quote.id).order("position"),
    getQuoteTotals(supabase, [quote.id]),
    getBusinessProfile(supabase),
    quote.lead_id
      ? supabase.from("leads").select("id, name, company, email, phone").eq("id", quote.lead_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    quote: quote as import("./types").Quote,
    items: (items ?? []) as import("./types").QuoteItem[],
    totals: totals.get(quote.id),
    profile,
    client: client as { id: string; name: string; company: string | null; email: string | null; phone: string | null } | null,
  };
}
