import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getQuoteTotals } from "@/lib/quote-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card, Stat } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { leadStatus } from "@/lib/crm";
import { effectiveQuoteStatus } from "@/lib/quotes";
import { daysAgoISO, formatDate, formatMoney, todayISO } from "@/lib/format";
import { modules } from "@/lib/modules";
import type { Lead, Quote } from "@/lib/types";

export default async function ResumenPage() {
  const supabase = await createClient();
  const [{ data: leadsData }, { data: quotesData }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("quotes").select("*"),
  ]);
  const leads = (leadsData ?? []) as Lead[];
  const quotes = (quotesData ?? []) as Quote[];
  const totals = await getQuoteTotals(supabase, quotes.map((q) => q.id));

  const today = todayISO();
  const year = today.slice(0, 4);
  const monthAgo = daysAgoISO(30);

  const open = leads.filter((l) => !["ganado", "perdido"].includes(l.status));
  const followUps = open
    .filter((l) => l.next_follow_up && l.next_follow_up <= today)
    .sort((a, b) => a.next_follow_up!.localeCompare(b.next_follow_up!));
  const newLeads = leads.filter((l) => l.created_at >= monthAgo).length;
  const pending = quotes.filter((q) => effectiveQuoteStatus(q.status, q.valid_until) === "enviado");
  const won = quotes.filter((q) => q.status === "aceptado" && (q.accepted_at ?? q.issue_date).startsWith(year));
  const cop = (list: Quote[]) => list.reduce((s, q) => s + Number(totals.get(q.id)?.total_cop ?? 0), 0);

  return (
    <>
      <PageHeader title="Resumen" description={formatDate(today)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Leads activos" value={String(open.length)} hint={`${newLeads} nuevo${newLeads === 1 ? "" : "s"} en 30 días`} />
        <Stat label="Seguimientos pendientes" value={String(followUps.length)} hint="Para hoy o atrasados" />
        <Stat label="Presupuestos por responder" value={formatMoney(cop(pending), "COP")} hint={`${pending.length} enviado${pending.length === 1 ? "" : "s"}`} />
        <Stat label={`Cerrado en ${year}`} value={formatMoney(cop(won), "COP")} hint={`${won.length} aceptado${won.length === 1 ? "" : "s"}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Seguimientos">
          {followUps.length ? (
            <ul className="divide-y divide-border">
              {followUps.slice(0, 8).map((l) => {
                const st = leadStatus(l.status);
                return (
                  <li key={l.id}>
                    <Link href={`/crm/${l.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-accent">
                      <span className="min-w-0 truncate">
                        <span className="font-medium">{l.name}</span>
                        {l.company && <span className="text-muted"> · {l.company}</span>}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <Badge tone={st.tone}>{st.label}</Badge>
                        <span className={`text-xs ${l.next_follow_up! < today ? "text-red-600 dark:text-red-400" : "text-muted"}`}>
                          {formatDate(l.next_follow_up)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nada pendiente. 👌</p>
          )}
        </Card>

        <Card title="Próximamente">
          <ul className="divide-y divide-border">
            {modules
              .filter((m) => ["analitica", "conversion", "redes", "portfolio"].includes(m.key))
              .map((m) => (
                <li key={m.key}>
                  <Link href={m.href} className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-accent">
                    <span>
                      <span className="font-medium">{m.label}</span>
                      <span className="ml-2 text-muted">{m.source}</span>
                    </span>
                    <span aria-hidden className="text-muted">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
