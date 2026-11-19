import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/form";
import { LEAD_STATUSES, sourceLabel } from "@/lib/crm";
import { formatDate, formatMoney, todayISO } from "@/lib/format";
import { SegmentedNav } from "@/components/ui/segmented-nav";
import { getQuoteTotals } from "@/lib/quote-data";
import { manualRevenueCop } from "@/lib/clients";
import type { Lead } from "@/lib/types";
import { ArrowUpRight, CalendarClock } from "lucide-react";

export const metadata: Metadata = { title: "CRM" };

export default async function CrmPage({ searchParams }: PageProps<"/crm">) {
  const view = (await searchParams).vista === "clientes" ? "clientes" : "pipeline";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];
  const today = todayISO();
  const pendingFollowUps = leads.filter(
    (l) => l.next_follow_up && l.next_follow_up <= today && !["ganado", "perdido"].includes(l.status),
  ).length;

  return (
    <>
      <PageHeader
        title="CRM"
        description={
          leads.length
            ? `${leads.length} leads · ${pendingFollowUps} seguimiento${pendingFollowUps === 1 ? "" : "s"} para hoy o atrasado${pendingFollowUps === 1 ? "" : "s"}`
            : "Leads y clientes, desde el primer contacto hasta el cierre."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/crm/nuevo?tipo=cliente" className={buttonClass("secondary")}>Nuevo cliente</Link>
            <Link href="/crm/nuevo" className={buttonClass()}>Nuevo lead</Link>
          </div>
        }
      />

      <SegmentedNav
        label="Vista del CRM"
        active={view}
        className="mb-6"
        items={[
          { key: "pipeline", href: "/crm", label: "Pipeline" },
          { key: "clientes", href: "/crm?vista=clientes", label: `Clientes · ${leads.filter((l) => l.status === "ganado").length}` },
        ]}
      />

      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}

      {view === "clientes" ? (
        <ClientsView clients={leads.filter((l) => l.status === "ganado")} />
      ) : leads.length === 0 ? (
        <EmptyState
          title="Todavía no hay leads"
          description="Crea el primero a mano. Más adelante llegarán solos desde el formulario de la web."
          action={<Link href="/crm/nuevo" className={buttonClass()}>Crear lead</Link>}
        />
      ) : (
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {LEAD_STATUSES.map((status) => {
            const column = leads.filter((l) => l.status === status.value);
            return (
              <section key={status.value} className="w-72 shrink-0 snap-start">
                <header className="mb-3 flex items-center justify-between px-1">
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">{column.length}</span>
                </header>
                <ul className="space-y-2">
                  {column.map((lead) => (
                    <li key={lead.id}>
                      <LeadCard lead={lead} today={today} />
                    </li>
                  ))}
                  {column.length === 0 && (
                    <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Vacío
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

async function ClientsView({ clients }: { clients: Lead[] }) {
  if (clients.length === 0) {
    return (
      <EmptyState
        title="Aún no hay clientes"
        description="Registra a los clientes a los que ya les entregaste un proyecto, o marca un lead como «Ganado»."
        action={<Link href="/crm/nuevo?tipo=cliente" className={buttonClass()}>Registrar cliente</Link>}
      />
    );
  }

  // Cobrado por cliente: presupuestos aceptados; si no tiene, el monto registrado a mano
  const supabase = await createClient();
  const { data: accepted } = await supabase
    .from("quotes")
    .select("id, lead_id")
    .eq("status", "aceptado")
    .in("lead_id", clients.map((c) => c.id));
  const totals = await getQuoteTotals(supabase, (accepted ?? []).map((q) => q.id));
  const quotedCop = new Map<string, number>();
  for (const q of accepted ?? []) {
    quotedCop.set(q.lead_id, (quotedCop.get(q.lead_id) ?? 0) + Number(totals.get(q.id)?.total_cop ?? 0));
  }
  const rows = clients
    .map((c) => ({
      ...c,
      cop: quotedCop.has(c.id) ? quotedCop.get(c.id)! : manualRevenueCop(c),
      fromQuotes: quotedCop.has(c.id),
    }))
    .sort((a, b) => (b.delivered_at ?? b.created_at).localeCompare(a.delivered_at ?? a.created_at));
  const total = rows.reduce((s, r) => s + r.cop, 0);

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {rows.length} cliente{rows.length === 1 ? "" : "s"} · {formatMoney(total, "COP")} cobrados en total
      </p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Sitio entregado</th>
              <th className="px-4 py-3 font-medium">Entregado</th>
              <th className="px-4 py-3 font-medium">Origen</th>
              <th className="px-4 py-3 text-right font-medium">Cobrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-accent/40">
                <td className="px-4 py-3">
                  <Link href={`/crm/${c.id}`} className="font-medium hover:text-brand">{c.company || c.name}</Link>
                  {c.company && <p className="text-xs text-muted-foreground">{c.name}</p>}
                </td>
                <td className="px-4 py-3">
                  {c.delivered_url ? (
                    <a href={c.delivered_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-brand">
                      {c.delivered_url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(c.delivered_at)}</td>
                <td className="px-4 py-3 text-muted-foreground">{sourceLabel(c.source) ?? "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {c.cop ? formatMoney(c.cop, "COP") : <span className="text-muted-foreground">—</span>}
                  {c.fromQuotes && <p className="text-xs text-muted-foreground">por presupuesto</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LeadCard({ lead, today }: { lead: Lead; today: string }) {
  const overdue =
    lead.next_follow_up && lead.next_follow_up <= today && !["ganado", "perdido"].includes(lead.status);

  return (
    <Link
      href={`/crm/${lead.id}`}
      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/30"
    >
      <p className="font-medium leading-tight">{lead.name}</p>
      {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {lead.estimated_value != null ? (
          <span className="font-medium text-foreground tabular-nums">
            {formatMoney(lead.estimated_value, lead.currency)}
          </span>
        ) : lead.form_data?.budget ? (
          <span className="text-foreground">{lead.form_data.budget}</span>
        ) : null}
        {lead.form_data?.service && <span>{lead.form_data.service}</span>}
        {lead.source && <span>{sourceLabel(lead.source)}</span>}
        {lead.next_follow_up && (
          <span className={`inline-flex items-center gap-1 ${overdue ? "font-medium text-destructive" : ""}`}>
            <CalendarClock aria-label="Seguimiento" className="size-3.5" />
            {formatDate(lead.next_follow_up)}
          </span>
        )}
      </div>
    </Link>
  );
}
