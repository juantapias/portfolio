import "server-only";
import { JWT } from "google-auth-library";

/**
 * Cliente de la cuenta de servicio de Google (GA4 Data API + Search Console API).
 * Las respuestas se guardan en memoria unos minutos: los datos de GA4/GSC no
 * cambian segundo a segundo y así no gastamos cuota en cada recarga.
 */

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];
const TTL_MS = 10 * 60_000;

let client: JWT | null = null;
const cache = new Map<string, { at: number; data: unknown }>();

export function isGoogleConfigured() {
  return Boolean(
    process.env.GOOGLE_SA_CLIENT_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY && process.env.GA4_PROPERTY_ID,
  );
}

function getClient() {
  if (!client) {
    client = new JWT({
      email: process.env.GOOGLE_SA_CLIENT_EMAIL,
      // En .env.local va con "\n" escapados; en Vercel, con saltos reales. Soporta ambos.
      key: process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });
  }
  return client;
}

async function post<T>(url: string, body: object): Promise<T> {
  const key = url + JSON.stringify(body);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;

  // Un reintento ante fallos de red (sin respuesta HTTP); los errores de la API no se reintentan
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await getClient().request<T>({ url, method: "POST", data: body });
      cache.set(key, { at: Date.now(), data: res.data });
      return res.data;
    } catch (error) {
      const e = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      if (!e.response && attempt === 0) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      throw new Error(e.response?.data?.error?.message ?? e.message ?? "Error de Google API");
    }
  }
}

// ─── GA4 Data API ──────────────────────────────────────────────────

export interface GaRow {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}
export interface GaReport {
  rows?: GaRow[];
}

export function runReport(body: object) {
  return post<GaReport>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
    body,
  );
}

// ─── Search Console API ────────────────────────────────────────────

export interface GscRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export function searchAnalytics(body: object) {
  const site = encodeURIComponent(process.env.GSC_SITE_URL ?? "sc-domain:juantapias.dev");
  return post<{ rows?: GscRow[] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    body,
  );
}
