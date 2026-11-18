"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: boolean };

const text = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
};

export async function saveProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const legal_name = text(fd, "legal_name");
  const document_number = text(fd, "document_number");
  if (!legal_name || !document_number) return { error: "Nombre y número de documento son obligatorios." };

  const supabase = await createClient();
  const { error } = await supabase.from("business_profile").upsert({
    id: true,
    legal_name,
    document_number,
    trade_name: text(fd, "trade_name"),
    document_type: text(fd, "document_type") ?? "CC",
    tax_regime: text(fd, "tax_regime") ?? "No responsable de IVA",
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    city: text(fd, "city"),
    website: text(fd, "website"),
    payment_methods: text(fd, "payment_methods"),
    default_payment_terms: text(fd, "default_payment_terms"),
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
