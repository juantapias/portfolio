import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getQuoteTotals } from "@/lib/quote-data";
import { PageHeader } from "@/components/ui/page-header";
import { Stat } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/form";
import { QUOTE_STATUSES, effectiveQuoteStatus, quoteStatus } from "@/lib/quotes";
import { formatDate, formatMoney } from "@/lib/format";
import type { Quote, QuoteStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Presupuestos" };

export default async function QuotesPage({ searchParams }: PageProps<"/presupuestos">) {
  const { estado } = await searchParams;
  const filter = QUOTE_STATUSES.some((s) => s.value === estado) ? (estado as QuoteStatus) : null;

  const supabase = await createClient();
  const [{ data }, { data: leads }] = await Promise.all([
    supabase.from("quotes").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("id, name, company"),
  ]);

  const all = ((data ?? []) as Quote[]).map((q) => ({ ...q, effective: effectiveQuoteStatus(q.status, q.valid_until) }));
  const totals = await getQuoteTotals(supabase, all.map((q) => q.id));
  const leadById = new Map((leads ?? []).map((l) => [l.id as string, l]));
  const quotes = filter ? all.filter((q) => q.effective === filter) : all;

  const year = new Date().getFullYear().toString();
  const sumCop = (list: typeof all) => list.reduce((s, q) => s + Number(totals.get(q.id)?.total_cop ?? 0), 0);
  const pending = all.filter((q) => q.effective === "enviado");
  const won = all.filter((q) => q.status === "aceptado" && (q.accepted_at ?? q.issue_date).startsWith(year));
  const decided = all.filter((q) => ["aceptado", "rechazado", "vencido"].includes(q.effective));
  const winRate = decided.length ? Math.round((won.length / decided.length) * 100) : null;

  return (
    <>
      <PageHeader
        title="Presupuestos"
        description="Cotizaciones para leads y clientes."
        actions={
          <div className="flex gap-2">
            <Link href="/presupuestos/servicios" className={buttonClass("secondary")}>Servicios</Link>
            <Link href="/presupuestos/nuevo" className={buttonClass()}>Nuevo presupuesto</Link>
          </div>
        }
      />

      {all.length === 0 ? (
        <EmptyState
          title="Aún no hay presupuestos"
          description="Crea uno desde aquí o desde la ficha de un lead. Tip: carga primero tus servicios frecuentes con sus precios."
          action={
            <div className="flex justify-center gap-2">
              <Link href="/presupuestos/servicios" className={buttonClass("secondary")}>Cargar servicios</Link>
              <Link href="/presupuestos/nuevo" className={buttonClass()}>Crear presupuesto</Link>
            </div>
          }
        />
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Pendientes de respuesta" value={formatMoney(sumCop(pending), "COP")} hint={`${pending.length} enviado${pending.length === 1 ? "" : "s"}`} />
            <Stat label={`Aceptado en ${year}`} value={formatMoney(sumCop(won), "COP")} hint={`${won.length} presupuesto${won.length === 1 ? "" : "s"}`} />
            <Stat label="Tasa de cierre" value={winRate === null ? "—" : `${winRate}%`} hint="Aceptados ÷ (aceptados + rechazados + vencidos)" />
          </div>

          <nav className="mb-4 flex flex-wrap gap-1 text-sm" aria-label="Filtrar por estado">
            <FilterLink href="/presupuestos" active={!filter} label="Todos" count={all.length} />
            {QUOTE_STATUSES.map((s) => (
              <FilterLink
                key={s.value}
                href={`/presupuestos?estado=${s.value}`}
                active={filter === s.value}
                label={s.label}
                count={all.filter((q) => q.effective === s.value).length}
              />
            ))}
          </nav>

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border text-left text-xs text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Número</th>
                  <th className="px-4 py-3 font-medium">Presupuesto</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Válido hasta</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map((q) => {
                  const lead = q.lead_id ? leadById.get(q.lead_id) : null;
                  const st = quoteStatus(q.effective);
                  const t = totals.get(q.id);
                  return (
                    <tr key={q.id} className="hover:bg-background">
                      <td className="px-4 py-3 tabular-nums text-muted">
                        <Link href={`/presupuestos/${q.id}`} className="hover:text-foreground">{q.number}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/presupuestos/${q.id}`} className="font-medium hover:text-accent">{q.title}</Link>
                        {lead && <p className="text-xs text-muted">{lead.company || lead.name}</p>}
                      </td>
                      <td className="px-4 py-3"><Badge tone={st.tone}>{st.label}</Badge></td>
                      <td className="px-4 py-3 text-muted">{formatDate(q.valid_until)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatMoney(t?.total, q.currency)}
                        {q.currency !== "COP" && <p className="text-xs text-muted">≈ {formatMoney(t?.total_cop, "COP")}</p>}
                      </td>
                    </tr>
                  );
                })}
                {quotes.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Nada con este estado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function FilterLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 ${active ? "bg-foreground text-background" : "text-muted hover:bg-surface hover:text-foreground"}`}
    >
      {label} <span className="tabular-nums opacity-60">{count}</span>
    </Link>
  );
}
