import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { QuoteForm } from "../quote-form";
import { getQuoteFormData } from "../form-data";

export const metadata: Metadata = { title: "Nuevo presupuesto" };

export default async function NewQuotePage({ searchParams }: PageProps<"/presupuestos/nuevo">) {
  const { lead } = await searchParams;
  const supabase = await createClient();
  const data = await getQuoteFormData(supabase);

  return (
    <>
      <PageHeader title="Nuevo presupuesto" />
      <QuoteForm {...data} defaultLeadId={typeof lead === "string" ? lead : undefined} />
    </>
  );
}
