import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuoteBundle } from "@/lib/quote-data";
import { QuoteDocument } from "@/components/quote-document";
import { PrintButton } from "@/components/print-button";
import { CopyLinkButton } from "@/components/copy-button";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/form";
import { effectiveQuoteStatus, quoteStatus } from "@/lib/quotes";
import { formatMoney } from "@/lib/format";
import { deleteQuote, duplicateQuote, setQuoteStatus } from "../actions";
import type { QuoteStatus } from "@/lib/types";
import { BackLink } from "@/components/ui/mobile";

export async function generateMetadata({ params }: PageProps<"/presupuestos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("quotes").select("number, title").eq("id", id).maybeSingle();
  return { title: data ? `${data.number} · ${data.title}` : "Presupuesto" };
}

export default async function QuotePage({ params }: PageProps<"/presupuestos/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const bundle = await getQuoteBundle(supabase, { id });
  if (!bundle) notFound();

  const { quote, client, totals } = bundle;
  const effective = effectiveQuoteStatus(quote.status, quote.valid_until);
  const st = quoteStatus(effective);

  return (
    <>
      <div className="print:hidden">
        <BackLink href="/presupuestos" label="Presupuestos" />

        <header className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl leading-tight md:text-4xl">{quote.number}</h1>
              <Badge tone={st.tone}>{st.label}</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {quote.title}
              {client && (
                <>
                  {" · "}
                  <Link href={`/crm/${client.id}`} className="hover:text-brand">{client.company || client.name}</Link>
                </>
              )}
            </p>
          </div>
          {/* Móvil: cuadrícula de botones iguales a todo el ancho */}
          <div className="grid w-full auto-cols-fr grid-flow-col gap-2 md:flex md:w-auto md:flex-wrap [&_button]:w-full max-md:[&_a]:h-11 max-md:[&_button]:h-11">
            <Link href={`/presupuestos/${quote.id}/editar`} className={buttonClass("secondary")}>Editar</Link>
            <PrintButton />
            {quote.status !== "borrador" && <CopyLinkButton path={`/p/${quote.public_token}`} label="Copiar enlace" />}
          </div>
        </header>

        <StatusActions id={quote.id} status={quote.status} effective={effective} />

        {quote.currency !== "COP" && totals && (
          <p className="mb-4 text-sm text-muted-foreground">
            Equivale a <span className="font-medium text-foreground">{formatMoney(totals.total_cop, "COP")}</span> a una tasa de{" "}
            {Number(quote.fx_rate_cop).toLocaleString("es-CO")} COP/{quote.currency}.
          </p>
        )}
      </div>

      <QuoteDocument {...bundle} />

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-2 print:hidden [&_button]:h-11 md:[&_button]:h-9">
        <form action={duplicateQuote}>
          <input type="hidden" name="id" value={quote.id} />
          <Button variant="ghost">Duplicar</Button>
        </form>
        <form action={deleteQuote}>
          <input type="hidden" name="id" value={quote.id} />
          <ConfirmButton variant="danger" message={`¿Eliminar el presupuesto ${quote.number}?`}>Eliminar</ConfirmButton>
        </form>
      </div>
    </>
  );
}

function StatusActions({ id, status, effective }: { id: string; status: QuoteStatus; effective: QuoteStatus }) {
  const actions: { to: QuoteStatus; label: string; variant: "primary" | "secondary" | "ghost"; hint?: string }[] =
    status === "borrador"
      ? [{ to: "enviado", label: "Marcar como enviado", variant: "primary", hint: "Habilita el enlace público y mueve el lead a «Propuesta»." }]
      : status === "enviado"
        ? [
            { to: "aceptado", label: "Aceptado", variant: "primary", hint: effective === "vencido" ? "La validez ya pasó, pero aún puedes registrar la respuesta." : "Mueve el lead a «Ganado»." },
            { to: "rechazado", label: "Rechazado", variant: "secondary" },
            { to: "borrador", label: "Volver a borrador", variant: "ghost" },
          ]
        : [{ to: "enviado", label: "Reabrir (enviado)", variant: "ghost" }];

  const hint = actions.find((a) => a.hint)?.hint;

  return (
    <div className="mb-6 grid gap-2 rounded-2xl border border-border bg-card p-3 md:flex md:flex-wrap md:items-center">
      {actions.map((a) => (
        <form key={a.to} action={setQuoteStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={a.to} />
          <Button variant={a.variant} className="h-11 w-full md:h-9 md:w-auto">{a.label}</Button>
        </form>
      ))}
      {hint && <p className="px-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
