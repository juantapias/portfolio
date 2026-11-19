import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getTRM } from "@/lib/trm";
import { LeadForm } from "../lead-form";

export async function generateMetadata({ searchParams }: PageProps<"/crm/nuevo">): Promise<Metadata> {
  return { title: (await searchParams).tipo === "cliente" ? "Nuevo cliente" : "Nuevo lead" };
}

export default async function NewLeadPage({ searchParams }: PageProps<"/crm/nuevo">) {
  const asClient = (await searchParams).tipo === "cliente";
  const trm = asClient ? await getTRM() : null;

  return (
    <>
      <PageHeader
        title={asClient ? "Nuevo cliente" : "Nuevo lead"}
        description={asClient ? "Un cliente al que ya le entregaste un proyecto." : undefined}
      />
      <LeadForm asClient={asClient} trm={trm} />
    </>
  );
}
