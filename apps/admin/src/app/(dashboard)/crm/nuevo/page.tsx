import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { LeadForm } from "../lead-form";

export const metadata: Metadata = { title: "Nuevo lead" };

export default function NewLeadPage() {
  return (
    <>
      <PageHeader title="Nuevo lead" />
      <LeadForm />
    </>
  );
}
