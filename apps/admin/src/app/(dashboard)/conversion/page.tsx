import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { createClient } from "@/lib/supabase/server";
import { getConversion } from "@/lib/conversion";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Conversión" };

const RANGES = [7, 28, 90] as const;
type Range = (typeof RANGES)[number];

const n = (v: number) => v.toLocaleString("es-CO");
const pct = (a: number | null, b: number | null) =>
  a == null || !b ? "—" : `${((a / b) * 100).toLocaleString("es-CO", { maximumFractionDigits: a / b < 0.1 ? 2 : 1 })}%`;

export default async function ConversionPage({ searchParams }: PageProps<"/conversion">) {
  const r = Number((await searchParams).rango);
  const range: Range = RANGES.includes(r as Range) ? (r as Range) : 28;

  const supabase = await createClient();
  const data = await getConversion(supabase, range);
  const f = data.funnel;
  const p = data.previous;

  const igSessions = data.channels.find((c) => c.key === "instagram")?.sessions ?? 0;
  const steps: { label: string; value: number | null; note: string | null; rate?: { value: number | null; base: number | null; title: string } }[] = [
    { label: "Alcance en Instagram", value: f.reach, note: data.sources.instagram },
    { label: "Visitas al perfil", value: f.profileViews, note: data.sources.instagram },
    {
      label: "Visitas a la web",
      value: f.sessions,
      note: data.sources.ga ?? `${n(igSessions)} desde Instagram · GA4, solo quien acepta cookies`,
      // Del perfil de Instagram solo cuentan las visitas que llegan desde Instagram
      rate: { value: igSessions, base: f.profileViews, title: "Visitas desde Instagram ÷ visitas al perfil" },
    },
    { label: "Leads", value: f.leads, note: "CRM · exacto" },
    { label: "Presupuestos enviados", value: f.quotesSent, note: null },
    { label: "Ventas cerradas", value: f.won, note: f.wonCop ? formatMoney(f.wonCop, "COP") : null },
  ];

  const leadRate = f.sessions ? f.leads / f.sessions : null;
  const prevLeadRate = p.sessions ? p.leads / p.sessions : null;

  return (
    <>
      <PageHeader
        title="Conversión"
        description="De la primera vista en redes hasta el dinero cerrado"
        actions={
          <nav aria-label="Periodo" className="flex rounded-md border border-border bg-surface p-0.5 text-sm">
            {RANGES.map((v) => (
              <Link
                key={v}
                href={`/conversion?rango=${v}`}
                aria-current={v === range ? "page" : undefined}
                className={`rounded px-3 py-1.5 ${v === range ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
              >
                {v} días
              </Link>
            ))}
          </nav>
        }
      />

      {/* ─── KPIs ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Leads" value={n(f.leads)} delta={<Delta current={f.leads} previous={p.leads} />} />
        <Kpi
          label="Visitas → lead"
          value={pct(f.leads, f.sessions)}
          delta={leadRate != null && prevLeadRate != null ? <Delta current={leadRate} previous={prevLeadRate} /> : <span className="text-xs text-muted">Leads del CRM ÷ sesiones de GA4</span>}
        />
        <Kpi
          label="Cerrado"
          value={formatMoney(f.wonCop, "COP")}
          delta={<Delta current={f.wonCop} previous={p.wonCop} />}
        />
        <Kpi
          label="Venta media · días al cierre"
          value={data.avgDeal != null ? formatMoney(data.avgDeal, "COP") : "—"}
          delta={
            <span className="text-xs text-muted">
              {data.avgCloseDays != null ? `${Math.round(data.avgCloseDays)} días desde el primer contacto` : "Sin ventas en el periodo"}
            </span>
          }
        />
      </div>

      {/* ─── Embudo ─── */}
      <Card title="Embudo" className="mt-6">
        <ol className="grid gap-3 md:grid-cols-6">
          {steps.map((s, i) => {
            const prev = i > 0 ? steps[i - 1].value : null;
            const rate = s.rate ? pct(s.rate.value, s.rate.base) : pct(s.value, prev);
            const rateTitle = s.rate?.title ?? `De «${steps[i - 1]?.label}» a «${s.label}»`;
            return (
              <li key={s.label} className="relative">
                {i > 0 && (
                  <p className="mb-1 text-xs font-medium tabular-nums text-accent md:absolute md:-left-3 md:-top-5 md:mb-0" title={rateTitle}>
                    → {rate}
                  </p>
                )}
                <div className="h-full rounded-md border border-border bg-background p-3">
                  <p className="text-xs text-muted">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value == null ? "—" : n(s.value)}</p>
                  {s.note && <p className="mt-1 text-[11px] leading-tight text-muted">{s.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-xs text-muted">
          El % de cada paso es sobre el anterior. GA4 cuenta de menos (consentimiento de cookies), así que «visitas → lead»
          sale más alto que la realidad; los leads, presupuestos y ventas son exactos.
          {range === 90 && " La API de Instagram no da alcance de más de 30 días: elige 7 o 28 días para ver el embudo completo."}
        </p>
      </Card>

      {/* ─── Por canal ─── */}
      <Card title="Por canal" className="mt-6">
        {data.channels.length ? (
          <Table
            first="Canal"
            rows={data.channels.map((c) => ({ ...c, name: c.label }))}
          />
        ) : (
          <p className="text-sm text-muted">Sin visitas ni leads en este periodo.</p>
        )}
        <p className="mt-3 text-xs text-muted">
          Los leads se atribuyen por la UTM con la que llegaron (o por el origen que elegiste en el CRM). Presupuestos y
          ventas heredan el canal de su lead.
        </p>
      </Card>

      {/* ─── Por campaña ─── */}
      <Card title="Por campaña (UTM)" className="mt-6">
        {data.campaigns.length ? (
          <Table first="Campaña" rows={data.campaigns.map((c) => ({ key: c.name, ...c }))} />
        ) : (
          <p className="text-sm text-muted">Ninguna visita ni lead con utm_campaign en este periodo.</p>
        )}
      </Card>
    </>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta: React.ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1">{delta}</p>
    </Card>
  );
}

function Table({
  first,
  rows,
}: {
  first: string;
  rows: { key: string; name: string; sessions: number; leads: number; quotesSent: number; won: number; wonCop: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="text-left text-xs text-muted">
          <tr>
            <th className="pb-2 font-medium">{first}</th>
            <th className="pb-2 text-right font-medium">Visitas</th>
            <th className="pb-2 text-right font-medium">Leads</th>
            <th className="pb-2 text-right font-medium">Visita → lead</th>
            <th className="pb-2 text-right font-medium">Presup.</th>
            <th className="pb-2 text-right font-medium">Ventas</th>
            <th className="pb-2 text-right font-medium">Cerrado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="py-2 pr-3">{r.name}</td>
              <td className="py-2 text-right tabular-nums">{n(r.sessions)}</td>
              <td className="py-2 text-right tabular-nums">{n(r.leads)}</td>
              <td className="py-2 text-right tabular-nums text-muted">{r.sessions ? pct(r.leads, r.sessions) : "—"}</td>
              <td className="py-2 text-right tabular-nums">{n(r.quotesSent)}</td>
              <td className="py-2 text-right tabular-nums">{n(r.won)}</td>
              <td className="py-2 text-right tabular-nums">{r.wonCop ? formatMoney(r.wonCop, "COP") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
