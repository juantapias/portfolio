"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUOTE_STATUSES } from "@/lib/quotes";
import type { QuoteStatus } from "@/lib/types";

export type FormState = { error?: string };

export interface ItemInput {
  id: string;
  description: string;
  details: string;
  quantity: number;
  unit_price: number;
}

const text = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
};
const num = (fd: FormData, key: string, fallback = 0) => {
  const v = Number(String(fd.get(key) ?? "").replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
};

function revalidateQuotes(leadId?: string | null) {
  revalidatePath("/presupuestos", "layout");
  if (leadId) revalidatePath(`/crm/${leadId}`);
  revalidatePath("/crm");
}

export async function saveQuote(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = text(fd, "id");
  const title = text(fd, "title");
  if (!title) return { error: "El título es obligatorio." };

  const currency = (text(fd, "currency") ?? "COP").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) return { error: "Moneda inválida." };

  const fx = currency === "COP" ? 1 : num(fd, "fx_rate_cop", 0);
  if (fx <= 0) return { error: `Indica cuántos COP vale 1 ${currency} (tasa de cambio).` };

  let items: ItemInput[];
  try {
    items = JSON.parse(String(fd.get("items") ?? "[]"));
  } catch {
    return { error: "Ítems inválidos." };
  }
  items = items.filter((i) => i.description.trim() !== "");
  if (items.length === 0) return { error: "Añade al menos un ítem." };
  if (items.some((i) => !(i.quantity > 0) || !(i.unit_price >= 0)))
    return { error: "Revisa cantidades y precios de los ítems." };

  const issueDate = text(fd, "issue_date");
  const validUntil = text(fd, "valid_until");
  if (issueDate && validUntil && validUntil < issueDate)
    return { error: "La fecha de validez no puede ser anterior a la de emisión." };

  const quote = {
    title,
    lead_id: text(fd, "lead_id"),
    currency,
    fx_rate_cop: fx,
    discount: Math.max(num(fd, "discount"), 0),
    tax_rate: fd.get("apply_tax") ? Math.max(num(fd, "tax_rate"), 0) : 0,
    ...(issueDate && { issue_date: issueDate }),
    ...(validUntil && { valid_until: validUntil }),
    intro: text(fd, "intro"),
    payment_terms: text(fd, "payment_terms"),
    notes: text(fd, "notes"),
  };

  const supabase = await createClient();
  let quoteId = id;

  if (quoteId) {
    const { error } = await supabase.from("quotes").update(quote).eq("id", quoteId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("quotes").insert(quote).select("id").single();
    if (error) return { error: error.message };
    quoteId = data.id as string;
  }

  // Primero upsert de los ítems actuales, después borrado de los que se quitaron:
  // si algo falla a mitad de camino no se pierden los ítems anteriores.
  const rows = items.map((i, position) => ({
    id: i.id,
    quote_id: quoteId,
    position,
    description: i.description.trim(),
    details: i.details?.trim() || null,
    quantity: i.quantity,
    unit_price: i.unit_price,
  }));
  const { error: upsertError } = await supabase.from("quote_items").upsert(rows);
  if (upsertError) return { error: upsertError.message };

  const keep = rows.map((r) => r.id);
  const { error: deleteError } = await supabase
    .from("quote_items")
    .delete()
    .eq("quote_id", quoteId)
    .not("id", "in", `(${keep.join(",")})`);
  if (deleteError) return { error: deleteError.message };

  revalidateQuotes(quote.lead_id);
  redirect(`/presupuestos/${quoteId}`);
}

export async function setQuoteStatus(fd: FormData) {
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as QuoteStatus;
  if (!QUOTE_STATUSES.some((s) => s.value === status)) return;

  const supabase = await createClient();
  // El trigger sincroniza el estado del lead y registra la actividad.
  const { data } = await supabase.from("quotes").update({ status }).eq("id", id).select("lead_id").single();
  revalidateQuotes(data?.lead_id);
}

export async function duplicateQuote(fd: FormData) {
  const id = String(fd.get("id"));
  const supabase = await createClient();

  const [{ data: src }, { data: items }] = await Promise.all([
    supabase.from("quotes").select("*").eq("id", id).single(),
    supabase.from("quote_items").select("*").eq("quote_id", id).order("position"),
  ]);
  if (!src) return;

  const { data: copy, error } = await supabase
    .from("quotes")
    .insert({
      lead_id: src.lead_id,
      title: `${src.title} (copia)`,
      currency: src.currency,
      fx_rate_cop: src.fx_rate_cop,
      discount: src.discount,
      tax_rate: src.tax_rate,
      intro: src.intro,
      payment_terms: src.payment_terms,
      notes: src.notes,
    })
    .select("id")
    .single();
  if (error || !copy) return;

  if (items?.length) {
    await supabase.from("quote_items").insert(
      items.map(({ description, details, quantity, unit_price, position }) => ({
        quote_id: copy.id,
        description,
        details,
        quantity,
        unit_price,
        position,
      })),
    );
  }

  revalidateQuotes(src.lead_id);
  redirect(`/presupuestos/${copy.id}/editar`);
}

export async function deleteQuote(fd: FormData) {
  const id = String(fd.get("id"));
  const supabase = await createClient();
  const { data } = await supabase.from("quotes").delete().eq("id", id).select("lead_id").single();
  revalidateQuotes(data?.lead_id);
  redirect("/presupuestos");
}

// ─── Servicios (plantillas) ─────────────────────────────────────────

export async function saveTemplate(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const template = { name, description: text(fd, "description") };

  let templateId = id;
  if (templateId) {
    const { error } = await supabase.from("service_templates").update(template).eq("id", templateId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("service_templates").insert(template).select("id").single();
    if (error) return { error: error.message };
    templateId = data.id as string;
  }

  const prices = [...fd.entries()]
    .filter(([k, v]) => k.startsWith("price_") && String(v).trim() !== "")
    .map(([k, v]) => ({
      template_id: templateId,
      currency: k.slice(6),
      unit_price: Number(String(v).replace(",", ".")),
    }))
    .filter((p) => Number.isFinite(p.unit_price) && p.unit_price >= 0);

  await supabase.from("service_template_prices").delete().eq("template_id", templateId);
  if (prices.length) {
    const { error } = await supabase.from("service_template_prices").insert(prices);
    if (error) return { error: error.message };
  }

  revalidatePath("/presupuestos", "layout");
  return {};
}

export async function deleteTemplate(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("service_templates").delete().eq("id", String(fd.get("id")));
  revalidatePath("/presupuestos", "layout");
}
