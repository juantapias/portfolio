import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { EmptyState } from "@/components/ui/empty-state";
import { LineChart } from "@/components/charts/line-chart";
import { BarList } from "@/components/charts/bar-list";
import { isGoogleConfigured } from "@/lib/google/client";
import { RANGES, getAnalytics, getSearch, parseRange, type RangeDays } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import { SegmentedNav } from "@/components/ui/segmented-nav";

export const metadata: Metadata = { title: "Analítica web" };

const CHANNELS: Record<string, string> = {
  Direct: "Directo",
  "Organic Search": "Búsqueda orgánica",
  "Organic Social": "Redes sociales",
  "Paid Social": "Redes (pago)",
  "Paid Search": "Búsqueda de pago",
  Referral: "Referencias",
  Email: "Email",
  Unassigned: "Sin asignar",
  "Cross-network": "Varias redes",
  "Organic Video": "Video orgánico",
};
const DEVICES: Record<string, string> = { desktop: "Escritorio", mobile: "Móvil", tablet: "Tablet" };

const n = (v: number) => v.toLocaleString("es-CO");
const pct = (v: number, digits = 0) => `${(v * 100).toLocaleString("es-CO", { maximumFractionDigits: digits })}%`;

export default async function AnalyticsPage({ searchParams }: PageProps<"/analitica">) {
  const range = parseRange((await searchParams).rango);

  if (!isGoogleConfigured()) {
    return (
      <>
        <PageHeader title="Analítica web" />
        <EmptyState
          title="Google no está conectado"
          description="Faltan las credenciales de la cuenta de servicio (GOOGLE_SA_* y GA4_PROPERTY_ID). Ver docs/integraciones.md."
        />
      </>
    );
  }

  const [ga, search] = await Promise.all([getAnalytics(range), getSearch(range)]);
  const overview = ga.overview.status === "fulfilled" ? ga.overview.value : null;

  return (
    <>
      <PageHeader
        title="Analítica web"
        description="Google Analytics 4 y Search Console · juantapias.dev"
        actions={<RangeFilter range={range} />}
      />

      <p className="mb-6 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
        GA4 solo mide a quien acepta las cookies, así que sus cifras están por debajo de la realidad. Los leads
        exactos están en el CRM.
      </p>

      {/* ─── Resumen ─── */}
      {overview ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {(
            [
              ["Sesiones", "sessions", n],
              ["Usuarios", "users", n],
              ["Tasa de interacción", "engagementRate", (v: number) => pct(v)],
              ["Leads", "leads", n],
            ] as const
          ).map(([label, key, fmt]) => (
            <Card key={key}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{fmt(overview.current[key])}</p>
              <p className="mt-1">
                <Delta current={overview.current[key]} previous={overview.previous[key]} />
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <SectionError reason={ga.overview.status === "rejected" ? ga.overview.reason : null} />
      )}

      <Card title="Sesiones por día" className="mt-6">
        {ga.series.status === "fulfilled" ? (
          <LineChart label="Sesiones" data={ga.series.value.map((d) => ({ date: d.date, value: d.sessions }))} />
        ) : (
          <SectionError reason={ga.series.reason} />
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Canales">
          {ga.channels.status === "fulfilled" ? (
            <BarList
              items={ga.channels.value.map((c) => ({
                label: CHANNELS[c.label] ?? c.label,
                value: c.sessions,
                hint: c.leads ? `${n(c.leads)} lead${c.leads === 1 ? "" : "s"}` : undefined,
              }))}
            />
          ) : (
            <SectionError reason={ga.channels.reason} />
          )}
        </Card>

        <Card title="Embudo de la landing (/web/)">
          {ga.funnel.status === "fulfilled" ? (
            <Funnel steps={ga.funnel.value} />
          ) : (
            <SectionError reason={ga.funnel.reason} />
          )}
        </Card>

        <Card title="Páginas más vistas">
          {ga.pages.status === "fulfilled" ? (
            <BarList items={ga.pages.value.map((p) => ({ label: p.path, value: p.views, hint: `${n(p.users)} usuario${p.users === 1 ? "" : "s"}` }))} />
          ) : (
            <SectionError reason={ga.pages.reason} />
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Campañas (UTM)">
            {ga.campaigns.status === "fulfilled" ? (
              ga.campaigns.value.length ? (
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-medium">Campaña</th>
                      <th className="pb-2 text-right font-medium">Sesiones</th>
                      <th className="pb-2 text-right font-medium">Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ga.campaigns.value.map((c) => (
                      <tr key={c.campaign + c.source}>
                        <td className="py-2">
                          {c.campaign}
                          <span className="block text-xs text-muted-foreground">{c.source}</span>
                        </td>
                        <td className="py-2 text-right tabular-nums">{n(c.sessions)}</td>
                        <td className="py-2 text-right tabular-nums">{n(c.leads)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground">Ninguna visita con UTM en este periodo.</p>
              )
            ) : (
              <SectionError reason={ga.campaigns.reason} />
            )}
          </Card>

          <Card title="Dispositivos">
            {ga.devices.status === "fulfilled" ? (
              <BarList items={ga.devices.value.map((d) => ({ label: DEVICES[d.label] ?? d.label, value: d.sessions }))} />
            ) : (
              <SectionError reason={ga.devices.reason} />
            )}
          </Card>
        </div>
      </div>

      {/* ─── Search Console ─── */}
      <section className="mt-12">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Google (Search Console)</h2>
          <p className="text-sm text-muted-foreground">
            Cómo te encuentran en Google · {formatDate(search.period.start)} – {formatDate(search.period.end)} (llega
            con ~2 días de retraso)
          </p>
        </div>

        {search.current ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {(
                [
                  ["Clics", "clicks", n, false],
                  ["Impresiones", "impressions", n, false],
                  ["CTR", "ctr", (v: number) => pct(v, 1), false],
                  ["Posición media", "position", (v: number) => (v ? v.toFixed(1) : "—"), true],
                ] as const
              ).map(([label, key, fmt, inverse]) => (
                <Card key={key}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums">{fmt(search.current![key])}</p>
                  <p className="mt-1">
                    <Delta current={search.current![key]} previous={search.previous?.[key] ?? 0} inverse={inverse} />
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
              <Card title="Búsquedas" className="lg:col-span-3">
                <SearchTable rows={search.queries.map((q) => ({ ...q, label: q.keys![0] }))} empty="Aún sin búsquedas registradas." />
              </Card>
              <Card title="Páginas en Google" className="lg:col-span-2">
                <SearchTable rows={search.pages.map((p) => ({ ...p, label: p.path || "/" }))} empty="Sin datos." compact />
              </Card>
            </div>
          </>
        ) : (
          <SectionError reason={new Error(search.error ?? "Error de Search Console")} />
        )}
      </section>
    </>
  );
}

function RangeFilter({ range }: { range: RangeDays }) {
  return (
    <SegmentedNav
      label="Periodo"
      size="sm"
      active={String(range)}
      items={RANGES.map((r) => ({ key: String(r.value), href: `/analitica?rango=${r.value}`, label: r.label }))}
    />
  );
}

function Funnel({ steps }: { steps: { step: string; users: number }[] }) {
  const first = steps[0]?.users ?? 0;
  if (!first) return <p className="text-sm text-muted-foreground">Nadie visitó la landing en este periodo.</p>;
  return (
    <BarList
      items={steps.map((s) => ({ label: s.step, value: s.users }))}
      format={(v) => `${n(v)} · ${pct(v / first)}`}
    />
  );
}

function SearchTable({
  rows,
  empty,
  compact = false,
}: {
  rows: { label: string; clicks: number; impressions: number; ctr: number; position: number }[];
  empty: string;
  compact?: boolean;
}) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr>
            <th className="pb-2 font-medium">{compact ? "Página" : "Búsqueda"}</th>
            <th className="pb-2 text-right font-medium">Clics</th>
            <th className="pb-2 text-right font-medium">Impr.</th>
            {!compact && <th className="pb-2 text-right font-medium">CTR</th>}
            <th className="pb-2 text-right font-medium">Pos.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="max-w-[16rem] truncate py-2 pr-3" title={r.label}>{r.label}</td>
              <td className="py-2 text-right tabular-nums">{n(r.clicks)}</td>
              <td className="py-2 text-right tabular-nums">{n(r.impressions)}</td>
              {!compact && <td className="py-2 text-right tabular-nums">{pct(r.ctr, 1)}</td>}
              <td className="py-2 text-right tabular-nums">{r.position.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionError({ reason }: { reason: unknown }) {
  return (
    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      No se pudo cargar: {reason instanceof Error ? reason.message : String(reason)}
    </p>
  );
}
