import Link from "next/link";
import { Suspense } from "react";
import { CalendarClock, ChartColumn, CircleCheck, FileText, Send, Trophy, Users, Workflow } from "lucide-react";
import { MarketingSummary, MarketingSummarySkeleton } from "./marketing-summary";
import { createClient } from "@/lib/supabase/server";
import { getQuoteTotals } from "@/lib/quote-data";
import { manualRevenueCop, manualSales } from "@/lib/clients";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardLink, Stat } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ColumnChart } from "@/components/charts/column-chart";
import { SegmentBar } from "@/components/charts/segment-bar";
import { LEAD_STATUSES, leadStatus } from "@/lib/crm";
import { effectiveQuoteStatus } from "@/lib/quotes";
import { daysAgoISO, formatDate, formatMoney, todayISO } from "@/lib/format";
import type { Lead, Quote } from "@/lib/types";

const WEEKS = 8;
const DAY = 864e5;
const plural = (n: number, s = "s") => (n === 1 ? "" : s);

/** Instante ISO → fecha local de Colombia (YYYY-MM-DD) */
const bogotaDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
/** YYYY-MM-DD → milisegundos UTC a medianoche (para aritmética de días sin zona horaria) */
const utc = (d: string) => Date.parse(`${d}T00:00:00Z`);
/** Lunes de la semana de una fecha, en ms UTC */
const mondayOf = (d: string) => {
  const t = utc(d);
  return t - ((new Date(t).getUTCDay() + 6) % 7) * DAY;
};
const shortDay = (ms: number) =>
  new Date(ms).toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: "UTC" });
/** Etiqueta compacta del eje ("28/9"): cabe incluso con 8 columnas en un teléfono */
const axisDay = (ms: number) => {
  const d = new Date(ms);
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
};

/** Leads creados por semana (lunes a domingo), de la más antigua a la actual */
function leadsPerWeek(leads: Lead[], today: string) {
  const thisMonday = mondayOf(today);
  const counts = Array<number>(WEEKS).fill(0);
  for (const l of leads) {
    const ago = Math.round((thisMonday - mondayOf(bogotaDate(l.created_at))) / (7 * DAY));
    if (ago >= 0 && ago < WEEKS) counts[WEEKS - 1 - ago]++;
  }
  return counts.map((value, i) => {
    const start = thisMonday - (WEEKS - 1 - i) * 7 * DAY;
    return {
      label: i === WEEKS - 1 ? "Actual" : axisDay(start),
      value,
      detail: `Semana del ${shortDay(start)} al ${shortDay(start + 6 * DAY)}`,
    };
  });
}

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
  const overdue = followUps.filter((l) => l.next_follow_up! < today).length;
  const newLeads = leads.filter((l) => l.created_at >= monthAgo).length;
  const pending = quotes
    .filter((q) => effectiveQuoteStatus(q.status, q.valid_until) === "enviado")
    .sort((a, b) => a.valid_until.localeCompare(b.valid_until));
  const won = quotes.filter((q) => q.status === "aceptado" && (q.accepted_at ?? q.issue_date).startsWith(year));
  const cop = (list: Quote[]) => list.reduce((s, q) => s + Number(totals.get(q.id)?.total_cop ?? 0), 0);
  // Clientes con cobro registrado a mano (sin presupuesto aceptado en el admin), entregados este año
  const acceptedLeads = new Set(quotes.filter((q) => q.status === "aceptado" && q.lead_id).map((q) => q.lead_id!));
  const manualWon = manualSales(leads, acceptedLeads).filter((l) => l.delivered_at!.startsWith(year));
  const wonCop = cop(won) + manualWon.reduce((s, l) => s + manualRevenueCop(l), 0);
  const wonCount = won.length + manualWon.length;
  const leadName = new Map(leads.map((l) => [l.id, l.company ? `${l.name} · ${l.company}` : l.name]));

  const weekly = leadsPerWeek(leads, today);
  const thisWeek = weekly.at(-1)!.value;
  const lastWeek = weekly.at(-2)!.value;
  const pipeline = LEAD_STATUSES.map((s) => ({
    label: s.label,
    tone: s.tone,
    value: leads.filter((l) => l.status === s.value).length,
  }));

  // Resumen en una frase: lo que pide acción hoy, antes que cualquier cifra
  const todo = [
    followUps.length && `${followUps.length} seguimiento${plural(followUps.length)} pendiente${plural(followUps.length)}`,
    pending.length && `${pending.length} presupuesto${plural(pending.length)} esperando respuesta`,
  ].filter(Boolean);
  const longDate = new Date(utc(today)).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  return (
    <>
      <PageHeader
        eyebrow={longDate}
        title="Resumen"
        description={todo.length ? `Hoy tienes ${todo.join(" y ")}.` : "Todo al día: no hay seguimientos ni presupuestos pendientes."}
      />

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat
          highlight
          href="/crm"
          icon={Users}
          label="Leads activos"
          value={String(open.length)}
          info="Leads que aún no están ganados ni perdidos."
          hint={`${newLeads} nuevo${plural(newLeads)} en los últimos 30 días`}
        />
        <Stat
          href="/crm"
          icon={CalendarClock}
          label="Seguimientos"
          value={String(followUps.length)}
          info="Leads abiertos con un seguimiento programado para hoy o una fecha ya pasada."
        >
          {overdue > 0 ? (
            <Badge tone="red">{overdue} atrasado{plural(overdue)}</Badge>
          ) : (
            <Badge tone="green">Al día</Badge>
          )}
        </Stat>
        <Stat
          href="/presupuestos"
          icon={Send}
          label="Por responder"
          value={formatMoney(cop(pending), "COP")}
          info="Valor en COP de los presupuestos enviados que siguen vigentes y sin respuesta."
          hint={`${pending.length} presupuesto${plural(pending.length)} enviado${plural(pending.length)}`}
        />
        <Stat
          href="/presupuestos"
          icon={Trophy}
          label={`Cerrado en ${year}`}
          value={formatMoney(wonCop, "COP")}
          info="Valor en COP de los presupuestos aceptados este año, más los cobros registrados a mano en clientes sin presupuesto en el admin."
          hint={`${wonCount} venta${plural(wonCount)}`}
        />
      </div>

      {/* ─── Tendencia + pipeline ─── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card
          title="Leads nuevos por semana"
          icon={ChartColumn}
          info="Leads creados cada semana (lunes a domingo), por formulario o carga manual."
          action={<CardLink href="/crm">Ver CRM</CardLink>}
          className="lg:col-span-8"
        >
          <p className="-mt-1 mb-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-medium tabular-nums">{thisWeek}</span>
            <span className="text-sm text-muted-foreground">
              esta semana · {lastWeek} la anterior
            </span>
          </p>
          <ColumnChart data={weekly} label="Leads nuevos por semana" />
        </Card>

        <Card title="Pipeline" icon={Workflow} info="Todos los leads según su etapa actual." className="lg:col-span-4">
          <p className="-mt-1 mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-medium tabular-nums">{leads.length}</span>
            <span className="text-sm text-muted-foreground">leads en total</span>
          </p>
          <SegmentBar items={pipeline} label="Leads por etapa" />
        </Card>
      </div>

      {/* ─── Marketing ─── */}
      <Suspense fallback={<MarketingSummarySkeleton />}>
        <MarketingSummary />
      </Suspense>

      {/* ─── Para atender ─── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card
          title="Seguimientos"
          icon={CalendarClock}
          action={followUps.length > 8 ? <CardLink href="/crm">Ver los {followUps.length}</CardLink> : undefined}
          className="lg:col-span-7"
        >
          {followUps.length ? (
            <ul className="-mx-2">
              {followUps.slice(0, 8).map((l) => {
                const st = leadStatus(l.status);
                const late = l.next_follow_up! < today;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/crm/${l.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-sm"
                        >
                          {l.name[0]?.toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{l.name}</span>
                          {l.company && <span className="block truncate text-xs text-muted-foreground">{l.company}</span>}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <Badge tone={st.tone} className="hidden sm:inline-flex">{st.label}</Badge>
                        <span className={`w-20 text-right text-xs tabular-nums ${late ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                          {late ? formatDate(l.next_follow_up) : "Hoy"}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={CircleCheck} title="Nada pendiente" description="No hay seguimientos para hoy ni atrasados." />
          )}
        </Card>

        <Card
          title="Esperando respuesta"
          icon={FileText}
          action={<CardLink href="/presupuestos">Presupuestos</CardLink>}
          className="lg:col-span-5"
        >
          {pending.length ? (
            <ul className="-mx-2">
              {pending.slice(0, 6).map((q) => {
                const days = Math.round((utc(q.valid_until) - utc(today)) / DAY);
                return (
                  <li key={q.id}>
                    <Link
                      href={`/presupuestos/${q.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{q.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {q.number}
                          {q.lead_id && leadName.get(q.lead_id) && ` · ${leadName.get(q.lead_id)}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-medium tabular-nums">
                          {formatMoney(totals.get(q.id)?.total ?? 0, q.currency)}
                        </span>
                        <span className={`block text-xs ${days <= 3 ? "text-warning" : "text-muted-foreground"}`}>
                          {days === 0 ? "Vence hoy" : `Vence en ${days} día${plural(days)}`}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={Send} title="Sin presupuestos en espera" description="Los presupuestos enviados y vigentes aparecerán aquí." />
          )}
        </Card>
      </div>
    </>
  );
}
