import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuoteBundle } from "@/lib/quote-data";
import { PageHeader } from "@/components/ui/page-header";
import { QuoteForm } from "../../quote-form";
import { getQuoteFormData } from "../../form-data";

export const metadata: Metadata = { title: "Editar presupuesto" };

export default async function EditQuotePage({ params }: PageProps<"/presupuestos/[id]/editar">) {
  const { id } = await params;
  const supabase = await createClient();
  const [bundle, data] = await Promise.all([getQuoteBundle(supabase, { id }), getQuoteFormData(supabase)]);
  if (!bundle) notFound();

  return (
    <>
      <PageHeader title={`Editar ${bundle.quote.number}`} />
      <QuoteForm {...data} quote={bundle.quote} items={bundle.items} />
    </>
  );
}
