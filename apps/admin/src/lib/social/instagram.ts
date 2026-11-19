import "server-only";

/**
 * Instagram (API Graph con inicio de sesión unificado de Meta).
 * Token de usuario del sistema, solo lectura (instagram_basic + instagram_manage_insights).
 *
 * Límites de la API: las estadísticas de cuenta aceptan ventanas de máx. 30 días,
 * y `follower_count` solo cubre los últimos 30 días. Por eso el módulo ofrece 7 y 28 días.
 */

const GRAPH = "https://graph.facebook.com/v23.0";
const TTL_MS = 10 * 60_000;
const cache = new Map<string, { at: number; data: unknown }>();

export function isInstagramConfigured() {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID);
}

async function graph<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const key = `${path}?${qs}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;

  qs.set("access_token", process.env.INSTAGRAM_ACCESS_TOKEN!);
  const res = await fetch(`${GRAPH}/${path}?${qs}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `Instagram API ${res.status}`);
  cache.set(key, { at: Date.now(), data: json });
  return json as T;
}

const unix = (d: Date) => Math.floor(d.getTime() / 1000);

/** Ventana [desde, hasta) de `days` días que termina hoy, desplazada `offset` periodos hacia atrás */
function window(days: number, offset = 0) {
  const until = new Date(Date.now() - offset * days * 864e5);
  const since = new Date(until.getTime() - days * 864e5);
  return { since: unix(since), until: unix(until) };
}

// ─── Perfil ────────────────────────────────────────────────────────

export interface IgProfile {
  username: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url?: string;
}

export function getProfile() {
  return graph<IgProfile>(process.env.INSTAGRAM_USER_ID!, {
    fields: "username,followers_count,follows_count,media_count,profile_picture_url",
  });
}

// ─── Estadísticas de cuenta ────────────────────────────────────────

const TOTAL_METRICS = ["reach", "views", "profile_views", "accounts_engaged", "total_interactions", "saves", "shares"] as const;
export type IgTotals = Record<(typeof TOTAL_METRICS)[number], number>;

async function totals(days: number, offset: number): Promise<IgTotals> {
  const r = await graph<{ data: { name: string; total_value?: { value: number } }[] }>(
    `${process.env.INSTAGRAM_USER_ID}/insights`,
    { metric: TOTAL_METRICS.join(","), period: "day", metric_type: "total_value", ...window(days, offset) },
  );
  const values = Object.fromEntries(r.data.map((m) => [m.name, m.total_value?.value ?? 0]));
  return Object.fromEntries(TOTAL_METRICS.map((m) => [m, values[m] ?? 0])) as IgTotals;
}

export async function getTotals(days: number) {
  const [current, previous] = await Promise.all([totals(days, 0), totals(days, 1)]);
  return { current, previous };
}

/** Serie diaria de una métrica (alcance o nuevos seguidores) */
export async function getDaily(metric: "reach" | "follower_count", days: number) {
  const r = await graph<{ data: { values: { value: number; end_time: string }[] }[] }>(
    `${process.env.INSTAGRAM_USER_ID}/insights`,
    { metric, period: "day", ...window(days) },
  );
  // end_time es el final del día (medianoche UTC del día siguiente): restamos un día para etiquetarlo
  return (r.data[0]?.values ?? []).map((v) => ({
    date: new Date(new Date(v.end_time).getTime() - 864e5).toISOString().slice(0, 10),
    value: v.value,
  }));
}

// ─── Publicaciones ─────────────────────────────────────────────────

export interface IgPost {
  id: string;
  caption?: string;
  media_type: string;
  media_product_type: string;
  timestamp: string;
  permalink: string;
  thumbnail_url?: string;
  media_url?: string;
  like_count?: number;
  comments_count?: number;
  insights?: { reach: number; views: number; saved: number; shares: number; total_interactions: number };
}

/** Publicaciones del periodo con sus estadísticas, ordenadas por vistas */
export async function getTopPosts(days: number, limit = 8) {
  const since = Date.now() - days * 864e5;
  const r = await graph<{ data: IgPost[] }>(`${process.env.INSTAGRAM_USER_ID}/media`, {
    fields: "id,caption,media_type,media_product_type,timestamp,permalink,thumbnail_url,media_url,like_count,comments_count",
    limit: 50,
  });
  const recent = r.data.filter((p) => new Date(p.timestamp).getTime() >= since).slice(0, 30);

  const withInsights = await Promise.all(
    recent.map(async (p) => {
      try {
        const ins = await graph<{ data: { name: string; values: { value: number }[] }[] }>(`${p.id}/insights`, {
          metric: "reach,views,saved,shares,total_interactions",
        });
        const v = Object.fromEntries(ins.data.map((m) => [m.name, m.values[0]?.value ?? 0]));
        return { ...p, insights: { reach: v.reach ?? 0, views: v.views ?? 0, saved: v.saved ?? 0, shares: v.shares ?? 0, total_interactions: v.total_interactions ?? 0 } };
      } catch {
        return p; // p. ej. publicaciones antiguas o tipos sin estadísticas
      }
    }),
  );

  return {
    count: recent.length,
    top: withInsights.sort((a, b) => (b.insights?.views ?? 0) - (a.insights?.views ?? 0)).slice(0, limit),
  };
}

// ─── Horarios ──────────────────────────────────────────────────────

/**
 * Seguidores conectados por hora, día a día, de los últimos ~30 días.
 * Meta entrega cada día con 24 claves ("0"…"23") en hora del Pacífico; `start`
 * es el inicio de ese día en UTC (end_time − 24 h) para convertirlo a otra zona.
 */
export async function getOnlineFollowers() {
  const now = unix(new Date());
  const r = await graph<{ data: { values: { value: Record<string, number>; end_time: string }[] }[] }>(
    `${process.env.INSTAGRAM_USER_ID}/insights`,
    { metric: "online_followers", period: "lifetime", since: now - 29 * 86400, until: now },
  );
  return (r.data[0]?.values ?? [])
    .filter((v) => v.value && Object.keys(v.value).length === 24)
    .map((v) => ({ start: new Date(v.end_time).getTime() - 864e5, hours: v.value }));
}

/** Fecha de publicación y resultados de las últimas publicaciones (una sola llamada) */
export async function getPostTimings(limit = 50) {
  const r = await graph<{
    data: { id: string; timestamp: string; insights?: { data: { name: string; values: { value: number }[] }[] } }[];
  }>(`${process.env.INSTAGRAM_USER_ID}/media`, {
    fields: "id,timestamp,insights.metric(reach,total_interactions)",
    limit,
  });
  return r.data.map((p) => {
    const v = Object.fromEntries((p.insights?.data ?? []).map((m) => [m.name, m.values[0]?.value ?? 0]));
    return { timestamp: new Date(p.timestamp).getTime(), reach: v.reach ?? 0, interactions: v.total_interactions ?? 0 };
  });
}
