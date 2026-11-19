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
import { manualRevenueCop } from "@/lib/clients";
import type { Lead, LeadActivity, Quote } from "@/lib/types";
import { StatusSelect } from "./status-select";
import { ActivityForm } from "./activity-form";
import { ArrowUpRight, Check, Mail, MessageCircle, PackageCheck, Phone, type LucideIcon } from "lucide-react";
import { BackLink } from "@/components/ui/mobile";

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
      <BackLink href="/crm" label="CRM" />

      <header className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4 md:mb-8">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl leading-tight text-balance md:text-4xl">{lead.name}</h1>
          {lead.company && <p className="mt-1 text-muted-foreground">{lead.company}</p>}
        </div>
        {/* Móvil: acciones a todo el ancho en cuadrícula; escritorio: en línea */}
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap">
          <div className="col-span-2 md:col-span-1">
            <StatusSelect id={lead.id} status={lead.status} />
          </div>
          <Link href={`/crm/${lead.id}/editar`} className={buttonClass("secondary", "h-11 md:h-9")}>Editar</Link>
          <Link href={`/presupuestos/nuevo?lead=${lead.id}`} className={buttonClass("primary", "h-11 md:h-9")}>Crear presupuesto</Link>
        </div>
      </header>

      {/* Contacto rápido (móvil): un toque para llamar, escribir por WhatsApp o enviar un correo */}
      {(lead.phone || lead.email) && (
        <nav aria-label="Contactar" className="mb-6 grid grid-cols-3 gap-2 md:hidden">
          <QuickAction icon={Phone} label="Llamar" href={lead.phone ? `tel:${lead.phone}` : null} />
          <QuickAction icon={MessageCircle} label="WhatsApp" href={whatsapp} external />
          <QuickAction icon={Mail} label="Email" href={lead.email ? `mailto:${lead.email}` : null} />
        </nav>
      )}

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
          {lead.status === "ganado" && (lead.delivered_at || lead.delivered_url || lead.paid_amount) && (
            <Card title="Proyecto entregado">
              <dl className="space-y-3 text-sm">
                <Row label="Entregado">
                  <span className="inline-flex items-center gap-1.5">
                    <PackageCheck aria-hidden className="size-4 text-success" />
                    {formatDate(lead.delivered_at)}
                  </span>
                </Row>
                {lead.delivered_url && (
                  <Row label="Sitio">
                    <a href={lead.delivered_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-brand">
                      {lead.delivered_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  </Row>
                )}
                {lead.paid_amount != null && (
                  <Row label="Cobrado">
                    {formatMoney(lead.paid_amount, lead.paid_currency ?? "COP")}
                    {lead.paid_currency && lead.paid_currency !== "COP" && (
                      <span className="block text-xs text-muted-foreground">≈ {formatMoney(manualRevenueCop(lead), "COP")}</span>
                    )}
                    {quotes?.some((q) => q.status === "aceptado") && (
                      <span className="block text-xs text-muted-foreground">
                        No suma en las métricas: ya cuenta su presupuesto aceptado.
                      </span>
                    )}
                  </Row>
                )}
              </dl>
            </Card>
          )}

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
              <Row label="Primer contacto">{formatDate(lead.created_at)}</Row>
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

function QuickAction({ icon: Icon, label, href, external = false }: { icon: LucideIcon; label: string; href: string | null; external?: boolean }) {
  const content = (
    <>
      <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-full bg-primary/12 text-brand">
        <Icon className="size-5" />
      </span>
      {label}
    </>
  );
  const cls = "pressable flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-xs font-medium";
  if (!href) {
    return (
      <span aria-disabled className={`${cls} opacity-40`}>
        {content}
      </span>
    );
  }
  return (
    <a href={href} className={cls} {...(external && { target: "_blank", rel: "noreferrer" })}>
      {content}
    </a>
  );
}
