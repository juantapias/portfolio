import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { LeadForm } from "../../lead-form";
import { deleteLead } from "../../actions";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = { title: "Editar lead" };

export default async function EditLeadPage({ params }: PageProps<"/crm/[id]/editar">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  return (
    <>
      <PageHeader title={`Editar · ${lead.name}`} />
      <LeadForm lead={lead} />

      <Card title="Zona de peligro" className="mt-10 max-w-3xl">
        <form action={deleteLead} className="flex flex-wrap items-center justify-between gap-3">
          <input type="hidden" name="id" value={lead.id} />
          <p className="text-sm text-muted">
            Elimina el lead y su historial. Sus presupuestos se conservan, sin cliente asociado.
          </p>
          <ConfirmButton variant="danger" message="¿Eliminar este lead y todo su historial?">Eliminar lead</ConfirmButton>
        </form>
      </Card>
    </>
  );
}
