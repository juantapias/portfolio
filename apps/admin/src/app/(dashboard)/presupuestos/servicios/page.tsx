import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TemplateForm } from "./template-form";
import { TemplateRow } from "./template-row";
import type { ServiceTemplate } from "@/lib/types";
import { BackLink } from "@/components/ui/mobile";

export const metadata: Metadata = { title: "Servicios" };

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_templates")
    .select("id, name, description, active, service_template_prices(currency, unit_price)")
    .order("name");
  const templates = (data ?? []) as ServiceTemplate[];

  return (
    <>
      <BackLink href="/presupuestos" label="Presupuestos" />
      <div className="mt-2">
        <PageHeader title="Servicios" description="Tu catálogo con precios por moneda. Se añaden a un presupuesto con un clic." />
      </div>

      <Card title="Nuevo servicio" className="mb-6">
        <TemplateForm />
      </Card>

      {templates.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {templates.map((t) => <TemplateRow key={t.id} template={t} />)}
        </ul>
      )}
    </>
  );
}
