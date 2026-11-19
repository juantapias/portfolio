"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUSES, leadStatus } from "@/lib/crm";
import type { LeadStatus } from "@/lib/types";

export type FormState = { error?: string };

const text = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
};

export async function saveLead(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return { error: "El nombre es obligatorio." };

  const value = text(fd, "estimated_value");
  const estimated = value ? Number(value.replace(/[^\d.]/g, "")) : null;
  if (estimated !== null && Number.isNaN(estimated)) return { error: "Valor estimado inválido." };

  const status = (text(fd, "status") ?? "nuevo") as LeadStatus;
  if (!LEAD_STATUSES.some((s) => s.value === status)) return { error: "Estado inválido." };

  // Cliente: proyecto entregado y cobro registrado a mano
  const paidRaw = text(fd, "paid_amount");
  const paidAmount = paidRaw ? Number(paidRaw.replace(/[^\d.]/g, "")) : null;
  if (paidAmount !== null && Number.isNaN(paidAmount)) return { error: "Monto cobrado inválido." };
  const paidCurrency = (text(fd, "paid_currency") ?? "COP").toUpperCase();
  const fxRaw = Number(String(fd.get("paid_fx_rate_cop") ?? "").replace(",", "."));
  const paidFx = paidCurrency === "COP" ? 1 : fxRaw;
  if (paidAmount && paidCurrency !== "COP" && !(paidFx > 0)) {
    return { error: `Indica cuántos COP vale 1 ${paidCurrency} para el monto cobrado.` };
  }
  const deliveredUrl = text(fd, "delivered_url");
  if (deliveredUrl && !/^https?:\/\//.test(deliveredUrl)) return { error: "El sitio entregado debe empezar por https://" };

  // Primer contacto: fecha real en que llegó (para que un cliente antiguo no cuente como lead nuevo)
  // Solo se guarda si cambió: así editar un lead de la landing no le borra la hora exacta de llegada
  const firstContactInput = text(fd, "first_contact");
  const firstContact = firstContactInput !== text(fd, "first_contact_original") ? firstContactInput : null;
  if (firstContact && firstContact > new Date().toISOString().slice(0, 10)) {
    return { error: "El primer contacto no puede ser una fecha futura." };
  }

  const lead = {
    name,
    company: text(fd, "company"),
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    message: text(fd, "message"),
    source: text(fd, "source"),
    status,
    estimated_value: estimated,
    currency: text(fd, "currency") ?? "COP",
    next_follow_up: text(fd, "next_follow_up"),
    delivered_at: text(fd, "delivered_at"),
    delivered_url: deliveredUrl,
    paid_amount: paidAmount,
    paid_currency: paidCurrency,
    paid_fx_rate_cop: paidFx > 0 ? paidFx : 1,
    // Mediodía en Colombia: evita que la fecha cambie de día por la zona horaria
    ...(firstContact && { created_at: `${firstContact}T12:00:00-05:00` }),
  };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from("leads").update(lead).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/crm", "layout");
    redirect(`/crm/${id}`);
  }

  const { data, error } = await supabase.from("leads").insert(lead).select("id").single();
  if (error) return { error: error.message };
  await supabase.from("lead_activities").insert({
    lead_id: data.id,
    type: "nota",
    content: status === "ganado" && (lead.delivered_at || lead.paid_amount) ? "Cliente registrado" : "Lead creado",
  });
  revalidatePath("/crm", "layout");
  redirect(`/crm/${data.id}`);
}

export async function updateLeadStatus(fd: FormData) {
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as LeadStatus;
  if (!LEAD_STATUSES.some((s) => s.value === status)) return;

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (!error) {
    await supabase.from("lead_activities").insert({
      lead_id: id,
      type: "cambio_estado",
      content: `Estado: ${leadStatus(status).label}`,
    });
  }
  revalidatePath("/crm", "layout");
}

/** Mover un lead de columna desde el tablero (arrastrar y soltar). */
export async function moveLead(id: string, status: LeadStatus): Promise<FormState> {
  if (!LEAD_STATUSES.some((s) => s.value === status)) return { error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  await supabase.from("lead_activities").insert({
    lead_id: id,
    type: "cambio_estado",
    content: `Estado: ${leadStatus(status).label}`,
  });
  revalidatePath("/crm", "layout");
  return {};
}

export async function addActivity(_prev: FormState, fd: FormData): Promise<FormState> {
  const leadId = String(fd.get("lead_id"));
  const content = text(fd, "content");
  if (!content) return { error: "Escribe algo." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lead_activities")
    .insert({ lead_id: leadId, type: text(fd, "type") ?? "nota", content });
  if (error) return { error: error.message };

  const followUp = text(fd, "next_follow_up");
  if (followUp) await supabase.from("leads").update({ next_follow_up: followUp }).eq("id", leadId);

  revalidatePath(`/crm/${leadId}`);
  return {};
}

export async function deleteLead(fd: FormData) {
  const id = String(fd.get("id"));
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", id);
  revalidatePath("/crm", "layout");
  redirect("/crm");
}
