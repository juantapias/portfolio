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
import { ChevronRight, Plus } from "lucide-react";
import { Fab } from "@/components/ui/mobile";
import { SegmentedNav } from "@/components/ui/segmented-nav";

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
            <Link href="/presupuestos/nuevo" className={buttonClass("primary", "hidden md:inline-flex")}>Nuevo presupuesto</Link>
          </div>
        }
      />
      {all.length > 0 && <Fab href="/presupuestos/nuevo" label="Nuevo presupuesto" icon={Plus} />}

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
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
            <Stat label="Pendientes de respuesta" value={formatMoney(sumCop(pending), "COP")} hint={`${pending.length} enviado${pending.length === 1 ? "" : "s"}`} />
            <Stat label={`Aceptado en ${year}`} value={formatMoney(sumCop(won), "COP")} hint={`${won.length} presupuesto${won.length === 1 ? "" : "s"}`} />
            <Stat label="Tasa de cierre" value={winRate === null ? "—" : `${winRate}%`} hint="Aceptados ÷ (aceptados + rechazados + vencidos)" />
          </div>

          <SegmentedNav
            label="Filtrar por estado"
            size="sm"
            active={filter ?? "todos"}
            className="mb-4"
            items={[
              { key: "todos", href: "/presupuestos", label: `Todos · ${all.length}` },
              ...QUOTE_STATUSES.map((s) => ({
                key: s.value,
                href: `/presupuestos?estado=${s.value}`,
                label: `${s.label} · ${all.filter((q) => q.effective === s.value).length}`,
              })),
            ]}
          />

          {/* Móvil: lista de tarjetas */}
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card md:hidden">
            {quotes.map((q) => {
              const lead = q.lead_id ? leadById.get(q.lead_id) : null;
              const st = quoteStatus(q.effective);
              const t = totals.get(q.id);
              return (
                <li key={q.id}>
                  <Link href={`/presupuestos/${q.id}`} className="flex items-center gap-3 px-4 py-3.5 active:bg-accent">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{q.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {q.number}
                        {lead && ` · ${lead.company || lead.name}`}
                      </span>
                      <span className="mt-1.5 flex items-center gap-2">
                        <Badge tone={st.tone}>{st.label}</Badge>
                        <span className="text-[11px] text-muted-foreground">hasta {formatDate(q.valid_until)}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-medium tabular-nums">{formatMoney(t?.total, q.currency)}</span>
                      {q.currency !== "COP" && (
                        <span className="block text-[11px] text-muted-foreground tabular-nums">≈ {formatMoney(t?.total_cop, "COP")}</span>
                      )}
                    </span>
                    <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
            {quotes.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nada con este estado.</li>}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
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
                    <tr key={q.id} className="hover:bg-accent">
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        <Link href={`/presupuestos/${q.id}`} className="hover:text-foreground">{q.number}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/presupuestos/${q.id}`} className="font-medium hover:text-brand">{q.title}</Link>
                        {lead && <p className="text-xs text-muted-foreground">{lead.company || lead.name}</p>}
                      </td>
                      <td className="px-4 py-3"><Badge tone={st.tone}>{st.label}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(q.valid_until)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatMoney(t?.total, q.currency)}
                        {q.currency !== "COP" && <p className="text-xs text-muted-foreground">≈ {formatMoney(t?.total_cop, "COP")}</p>}
                      </td>
                    </tr>
                  );
                })}
                {quotes.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nada con este estado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

