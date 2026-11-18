import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TemplateForm } from "./template-form";
import { TemplateRow } from "./template-row";
import type { ServiceTemplate } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

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
      <Link href="/presupuestos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" />Presupuestos</Link>
      <div className="mt-3">
        <PageHeader title="Servicios" description="Tu catálogo con precios por moneda. Se añaden a un presupuesto con un clic." />
      </div>

      <Card title="Nuevo servicio" className="mb-6">
        <TemplateForm />
      </Card>

      {templates.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {templates.map((t) => <TemplateRow key={t.id} template={t} />)}
        </ul>
      )}
    </>
  );
}
