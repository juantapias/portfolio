import "server-only";
import { runReport, searchAnalytics, type GaReport } from "./google/client";

export const RANGES = [
  { value: 7, label: "7 días" },
  { value: 28, label: "28 días" },
  { value: 90, label: "90 días" },
] as const;
export type RangeDays = (typeof RANGES)[number]["value"];

export function parseRange(value: unknown): RangeDays {
  const n = Number(value);
  return (RANGES.find((r) => r.value === n)?.value ?? 28) as RangeDays;
}

/** Fecha `YYYY-MM-DD` en Colombia, desplazada `offset` días */
function day(offset: number) {
  const d = new Date(Date.now() + offset * 864e5);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

const num = (v: string | undefined) => Number(v ?? 0);
const dims = (r: GaReport["rows"]) => r ?? [];

// Periodo actual = últimos N días incluyendo hoy; anterior = los N días previos
const current = (n: number) => ({ startDate: `${n - 1}daysAgo`, endDate: "today" });
const previous = (n: number) => ({ startDate: `${2 * n - 1}daysAgo`, endDate: `${n}daysAgo` });

export interface Totals {
  sessions: number;
  users: number;
  engagementRate: number;
  leads: number;
}

const LANDING = "^/(es|en)/web/";

/** Filtro del evento de lead. Se cuenta el evento (no `keyEvents`, que solo existe desde que se marcó como clave). */
const LEAD_FILTER = { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "generate_lead" } } };

/** Leads por valor de una dimensión (canal, campaña…) */
async function leadsBy(n: number, dimensions: { name: string }[]) {
  const r = await runReport({
    dateRanges: [current(n)],
    dimensions,
    metrics: [{ name: "eventCount" }],
    dimensionFilter: LEAD_FILTER,
  });
  return new Map(dims(r.rows).map((row) => [row.dimensionValues!.map((d) => d.value).join("|"), num(row.metricValues![0].value)]));
}

/** Todo lo que pinta el módulo de Analítica web, en paralelo. Cada sección falla por separado. */
export async function getAnalytics(n: RangeDays) {
  const [overview, series, channels, campaigns, pages, funnel, devices] = await Promise.allSettled([
    // 1. Totales del periodo actual vs anterior
    Promise.all([
      runReport({
        dateRanges: [current(n), previous(n)],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "engagementRate" }],
      }),
      runReport({
        dateRanges: [current(n), previous(n)],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: LEAD_FILTER,
      }),
    ]).then(([r, l]) => {
      const byRange = (rep: GaReport) =>
        new Map(dims(rep.rows).map((row) => [row.dimensionValues?.[0]?.value, row.metricValues ?? []]));
      const base = byRange(r);
      const leads = byRange(l);
      const toTotals = (range: string): Totals => {
        const m = base.get(range) ?? [];
        return {
          sessions: num(m[0]?.value),
          users: num(m[1]?.value),
          engagementRate: num(m[2]?.value),
          leads: num(leads.get(range)?.[0]?.value),
        };
      };
      return { current: toTotals("date_range_0"), previous: toTotals("date_range_1") };
    }),

    // 2. Serie diaria
    runReport({
      dateRanges: [current(n)],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }).then((r) => {
      const values = new Map(
        dims(r.rows).map((row) => [row.dimensionValues![0].value, row.metricValues!.map((m) => num(m.value))]),
      );
      // Rellena los días sin visitas con 0 para que la línea no salte
      return Array.from({ length: n }, (_, i) => {
        const date = day(i - (n - 1));
        const [sessions = 0] = values.get(date.replaceAll("-", "")) ?? [];
        return { date, sessions };
      });
    }),

    // 3. Canales
    Promise.all([
      runReport({
        dateRanges: [current(n)],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      leadsBy(n, [{ name: "sessionDefaultChannelGroup" }]),
    ]).then(([r, leads]) =>
      dims(r.rows).map((row) => ({
        label: row.dimensionValues![0].value,
        sessions: num(row.metricValues![0].value),
        leads: leads.get(row.dimensionValues![0].value) ?? 0,
      })),
    ),

    // 4. Campañas (UTM) — sin las pseudo-campañas de GA4
    Promise.all([runReport({
      dateRanges: [current(n)],
      dimensions: [{ name: "sessionCampaignName" }, { name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        notExpression: {
          filter: {
            fieldName: "sessionCampaignName",
            inListFilter: { values: ["(not set)", "(direct)", "(organic)", "(referral)", "(none)"] },
          },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
      leadsBy(n, [{ name: "sessionCampaignName" }, { name: "sessionSource" }, { name: "sessionMedium" }]),
    ]).then(([r, leads]) =>
      dims(r.rows).map((row) => ({
        campaign: row.dimensionValues![0].value,
        source: `${row.dimensionValues![1].value} / ${row.dimensionValues![2].value}`,
        sessions: num(row.metricValues![0].value),
        leads: leads.get(row.dimensionValues!.map((d) => d.value).join("|")) ?? 0,
      })),
    ),

    // 5. Páginas más vistas
    runReport({
      dateRanges: [current(n)],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }).then((r) =>
      dims(r.rows).map((row) => ({
        path: row.dimensionValues![0].value,
        views: num(row.metricValues![0].value),
        users: num(row.metricValues![1].value),
      })),
    ),

    // 6. Embudo de la landing (usuarios por evento en /es/web/ y /en/web/)
    runReport({
      dateRanges: [current(n)],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "totalUsers" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            { filter: { fieldName: "pagePath", stringFilter: { matchType: "FULL_REGEXP", value: `${LANDING}.*` } } },
            {
              filter: {
                fieldName: "eventName",
                inListFilter: { values: ["page_view", "form_start", "generate_lead"] },
              },
            },
          ],
        },
      },
    }).then((r) => {
      const users = new Map(dims(r.rows).map((row) => [row.dimensionValues![0].value, num(row.metricValues![0].value)]));
      return [
        { step: "Visitaron la landing", users: users.get("page_view") ?? 0 },
        { step: "Empezaron el formulario", users: users.get("form_start") ?? 0 },
        { step: "Enviaron (abrieron WhatsApp)", users: users.get("generate_lead") ?? 0 },
      ];
    }),

    // 7. Dispositivos
    runReport({
      dateRanges: [current(n)],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }).then((r) =>
      dims(r.rows).map((row) => ({ label: row.dimensionValues![0].value, sessions: num(row.metricValues![0].value) })),
    ),
  ]);

  return { overview, series, channels, campaigns, pages, funnel, devices };
}

/**
 * Search Console. Sus datos llegan con ~2 días de retraso, así que el periodo
 * termina hace 2 días (si no, los últimos días salen en cero y la comparación miente).
 */
export async function getSearch(n: RangeDays) {
  const end = day(-2);
  const start = day(-2 - (n - 1));
  const prevEnd = day(-2 - n);
  const prevStart = day(-2 - (2 * n - 1));

  const [totals, previousTotals, queries, pages] = await Promise.allSettled([
    searchAnalytics({ startDate: start, endDate: end }),
    searchAnalytics({ startDate: prevStart, endDate: prevEnd }),
    searchAnalytics({ startDate: start, endDate: end, dimensions: ["query"], rowLimit: 25 }),
    searchAnalytics({ startDate: start, endDate: end, dimensions: ["page"], rowLimit: 10 }),
  ]);

  const total = (r: typeof totals) =>
    r.status === "fulfilled"
      ? (r.value.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 })
      : null;
  // Con pocos clics, ordenar por impresiones muestra mejor por qué búsquedas apareces
  const byImpressions = <T extends { impressions: number; clicks: number }>(rows: T[] = []) =>
    [...rows].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  return {
    period: { start, end },
    current: total(totals),
    previous: total(previousTotals),
    error: totals.status === "rejected" ? (totals.reason as Error).message : null,
    queries: queries.status === "fulfilled" ? byImpressions(queries.value.rows) : [],
    pages:
      pages.status === "fulfilled"
        ? byImpressions(pages.value.rows).map((r) => ({ ...r, path: r.keys![0].replace(/^https?:\/\/[^/]+/, "") }))
        : [],
  };
}
