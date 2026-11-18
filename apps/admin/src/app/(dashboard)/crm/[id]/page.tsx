import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/form";
import { FORM_FIELDS, activityLabel, sourceLabel } from "@/lib/crm";
import { effectiveQuoteStatus, quoteStatus } from "@/lib/quotes";
import { formatDate, formatDateTime, formatMoney, todayISO } from "@/lib/format";
import { getQuoteTotals } from "@/lib/quote-data";
import type { Lead, LeadActivity, Quote } from "@/lib/types";
import { StatusSelect } from "./status-select";
import { ActivityForm } from "./activity-form";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/crm/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("name").eq("id", id).maybeSingle();
  return { title: data?.name ?? "Lead" };
}

export default async function LeadPage({ params }: PageProps<"/crm/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: leadData }, { data: activities }, { data: quotes }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("lead_activities").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("quotes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (!leadData) notFound();
  const lead = leadData as Lead;
  const totals = await getQuoteTotals(supabase, (quotes ?? []).map((q) => q.id));
  const overdue = lead.next_follow_up && lead.next_follow_up <= todayISO() && !["ganado", "perdido"].includes(lead.status);
  const whatsapp = lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}` : null;

  return (
    <>
      <Link href="/crm" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft aria-hidden className="size-4" />CRM</Link>

      <header className="mb-8 mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          {lead.company && <p className="mt-1 text-muted-foreground">{lead.company}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusSelect id={lead.id} status={lead.status} />
          <Link href={`/crm/${lead.id}/editar`} className={buttonClass("secondary")}>Editar</Link>
          <Link href={`/presupuestos/nuevo?lead=${lead.id}`} className={buttonClass()}>Crear presupuesto</Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {lead.form_data && (
            <Card title="Formulario de la landing">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                {FORM_FIELDS.filter((f) => lead.form_data?.[f.key]).map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-0.5 font-medium">{lead.form_data![f.key]}</dd>
                  </div>
                ))}
              </dl>
              {lead.ref && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Busca <span className="font-mono font-medium text-foreground">Ref: {lead.ref}</span> en WhatsApp para encontrar el chat.
                </p>
              )}
            </Card>
          )}

          {lead.message && (
            <Card title={lead.form_data ? "Comentarios" : "Necesidad"}>
              <p className="whitespace-pre-line text-sm">{lead.message}</p>
            </Card>
          )}

          <Card title="Historial">
            <ActivityForm leadId={lead.id} />
            <ol className="mt-6 space-y-4 border-l border-border pl-4">
              {(activities as LeadActivity[] | null)?.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-card bg-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{activityLabel(a.type)}</span> · {formatDateTime(a.created_at)}
                  </p>
                  {a.content && <p className="mt-0.5 whitespace-pre-line text-sm">{a.content}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Datos">
            <dl className="space-y-3 text-sm">
              <Row label="Email">
                {lead.email ? <a href={`mailto:${lead.email}`} className="hover:text-brand">{lead.email}</a> : "—"}
              </Row>
              <Row label="Teléfono">
                {lead.phone ? (
                  <span className="flex flex-wrap gap-x-2">
                    <a href={`tel:${lead.phone}`} className="hover:text-brand">{lead.phone}</a>
                    {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-brand">WhatsApp<ArrowUpRight aria-hidden className="size-3.5" /></a>}
                  </span>
                ) : "—"}
              </Row>
              <Row label="Valor estimado">
                {lead.estimated_value != null ? formatMoney(lead.estimated_value, lead.currency) : "—"}
              </Row>
              <Row label="Próximo seguimiento">
                <span className={overdue ? "font-medium text-destructive" : ""}>
                  {formatDate(lead.next_follow_up)}
                </span>
              </Row>
              <Row label="Origen">{sourceLabel(lead.source) ?? "—"}</Row>
              {(lead.utm_source || lead.utm_campaign) && (
                <Row label="Campaña">
                  {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")}
                </Row>
              )}
              {lead.landing_page && <Row label="Landing">{lead.landing_page}</Row>}
              {lead.form_data?.gclid && <Row label="Google Ads"><span className="inline-flex items-center gap-1">gclid<Check aria-label="detectado" className="size-3.5 text-success" /></span></Row>}
              {lead.form_data?.fbclid && <Row label="Meta Ads"><span className="inline-flex items-center gap-1">fbclid<Check aria-label="detectado" className="size-3.5 text-success" /></span></Row>}
              <Row label="Creado">{formatDate(lead.created_at)}</Row>
            </dl>
          </Card>

          <Card title="Presupuestos">
            {quotes && quotes.length > 0 ? (
              <ul className="divide-y divide-border">
                {(quotes as Quote[]).map((q) => {
                  const st = quoteStatus(effectiveQuoteStatus(q.status, q.valid_until));
                  return (
                    <li key={q.id}>
                      <Link href={`/presupuestos/${q.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-brand">
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{q.title}</span>
                          <span className="text-xs text-muted-foreground">{q.number}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block tabular-nums">{formatMoney(totals.get(q.id)?.total, q.currency)}</span>
                          <Badge tone={st.tone}>{st.label}</Badge>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin presupuestos todavía.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{children}</dd>
    </div>
  );
}
