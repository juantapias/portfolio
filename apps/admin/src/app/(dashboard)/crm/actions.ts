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
  await supabase.from("lead_activities").insert({ lead_id: data.id, type: "nota", content: "Lead creado" });
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
