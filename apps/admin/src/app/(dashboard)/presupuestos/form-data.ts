import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBusinessProfile } from "@/lib/quote-data";
import { getTRM } from "@/lib/trm";
import type { ServiceTemplate } from "@/lib/types";

/** Datos que necesita el formulario de presupuesto (clientes, servicios, TRM, perfil). */
export async function getQuoteFormData(supabase: SupabaseClient) {
  const [{ data: leads }, { data: templates }, profile, trm] = await Promise.all([
    supabase.from("leads").select("id, name, company").neq("status", "perdido").order("name"),
    supabase
      .from("service_templates")
      .select("id, name, description, active, service_template_prices(currency, unit_price)")
      .eq("active", true)
      .order("name"),
    getBusinessProfile(supabase),
    getTRM(),
  ]);

  return {
    leads: leads ?? [],
    templates: (templates ?? []) as ServiceTemplate[],
    defaultPaymentTerms: profile?.default_payment_terms ?? null,
    trm,
  };
}
