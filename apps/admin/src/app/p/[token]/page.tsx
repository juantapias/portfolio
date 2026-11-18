import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import { getQuoteBundle } from "@/lib/quote-data";
import { QuoteDocument } from "@/components/quote-document";
import { PrintButton } from "@/components/print-button";
import { effectiveQuoteStatus } from "@/lib/quotes";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function load(token: string) {
  if (!UUID.test(token)) return null;
  // Página pública: se busca por token con la clave secreta. Los borradores no se exponen.
  const bundle = await getQuoteBundle(createAdminClient(), { token });
  if (!bundle || bundle.quote.status === "borrador") return null;
  return bundle;
}

export async function generateMetadata({ params }: PageProps<"/p/[token]">): Promise<Metadata> {
  const bundle = await load((await params).token);
  if (!bundle) return { title: "Presupuesto" };
  const issuer = bundle.profile?.trade_name || bundle.profile?.legal_name;
  return {
    title: { absolute: `${bundle.quote.number} · ${bundle.quote.title}${issuer ? ` — ${issuer}` : ""}` },
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function PublicQuotePage({ params }: PageProps<"/p/[token]">) {
  const bundle = await load((await params).token);
  if (!bundle) notFound();

  // Si quien abre el enlace no es el admin, registra la apertura y avisa
  // (como mucho un aviso cada 6 h por presupuesto, para no repetir en cada recarga)
  const { data: session } = await (await createClient()).auth.getClaims();
  if (!session?.claims) {
    const { quote, client } = bundle;
    after(async () => {
      const now = new Date();
      const last = quote.last_viewed_at ? new Date(quote.last_viewed_at) : null;
      await createAdminClient()
        .from("quotes")
        .update({
          view_count: (quote.view_count ?? 0) + 1,
          last_viewed_at: now.toISOString(),
          ...(!quote.first_viewed_at && { first_viewed_at: now.toISOString() }),
        })
        .eq("id", quote.id);
      if (!last || now.getTime() - last.getTime() > 6 * 3600_000) {
        await notify({
          type: "presupuesto.visto",
          title: `${client?.company || client?.name || "Un cliente"} abrió el presupuesto ${quote.number}`,
          body: `${quote.title}${quote.first_viewed_at ? ` · Lo ha abierto ${(quote.view_count ?? 0) + 1} veces` : " · Primera apertura"}. Buen momento para hacer seguimiento.`,
          link: `/presupuestos/${quote.id}`,
          data: { quote_id: quote.id },
        });
      }
    });
  }

  const status = effectiveQuoteStatus(bundle.quote.status, bundle.quote.valid_until);
  const banner =
    status === "vencido"
      ? "Este presupuesto ya venció. Escríbeme si quieres que lo actualice."
      : status === "aceptado"
        ? "Presupuesto aceptado. ¡Gracias!"
        : status === "rechazado"
          ? "Este presupuesto fue cerrado."
          : null;

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8 sm:py-12 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-4 print:hidden">
        <p className="text-sm text-neutral-500">{banner}</p>
        <PrintButton />
      </div>
      <QuoteDocument {...bundle} />
    </main>
  );
}
