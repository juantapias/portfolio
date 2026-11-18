import { createHash } from "node:crypto";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/notifications";
import { channelFromSource } from "@/lib/conversion";

/**
 * Endpoint público que recibe el formulario de la landing del portfolio.
 *
 * La landing envía `text/plain` con JSON dentro: así es una "simple request"
 * (sin preflight CORS) y funciona con `fetch(..., { keepalive: true })` aunque
 * la página navegue a WhatsApp justo después.
 */

const ALLOWED_ORIGINS = (process.env.LEADS_ALLOWED_ORIGINS ?? "https://juantapias.dev,http://localhost:4321")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const MIN_FILL_MS = 3_000; // un humano no completa 5 pasos en menos de 3 s
const RATE_LIMIT = { max: 3, windowMinutes: 10 };

function cors(origin: string | null) {
  const headers: Record<string, string> = { Vary: "Origin" };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }
  return headers;
}

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  Response.json(body, { status, headers });

const str = (value: unknown, max: number) => {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, max);
  return v === "" ? null : v;
};

function detectSource(utmSource: string | null, clickIds: { gclid: string | null; fbclid: string | null }) {
  const s = utmSource?.toLowerCase() ?? "";
  if (/(^|[^a-z])(ig|instagram)/.test(s)) return "instagram";
  if (s.includes("tiktok")) return "tiktok";
  if (/(^|[^a-z])(fb|facebook|meta)/.test(s) || (!s && clickIds.fbclid)) return "facebook";
  if (s.includes("google") || (!s && clickIds.gclid)) return "google";
  if (s.includes("linkedin")) return "linkedin";
  return "web";
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get("origin")) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = cors(origin);

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: "origin_not_allowed" }, 403, headers);
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return json({ error: "too_large" }, 413, headers);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400, headers);
  }

  // Antispam: campo trampa y tiempo mínimo. Respondemos "ok" para no dar pistas al bot.
  const elapsed = Number(body.elapsed_ms);
  if (str(body.website, 200) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json({ ok: true }, 200, headers);
  }

  const name = str(body.name, 80);
  if (!name) return json({ error: "name_required" }, 422, headers);

  const ref = str(body.ref, 12);
  if (ref && !/^[A-Z0-9]{4,12}$/.test(ref)) return json({ error: "invalid_ref" }, 422, headers);

  const answers = (typeof body.answers === "object" && body.answers) || {};
  const source = (typeof body.source === "object" && body.source) || {};
  const a = answers as Record<string, unknown>;
  const s = source as Record<string, unknown>;

  const utm = {
    utm_source: str(s.utm_source, 150),
    utm_medium: str(s.utm_medium, 150),
    utm_campaign: str(s.utm_campaign, 150),
  };
  const clickIds = { gclid: str(s.gclid, 255), fbclid: str(s.fbclid, 255) };

  const formData = Object.fromEntries(
    Object.entries({
      service: str(a.service, 120),
      stage: str(a.stage, 120),
      budget: str(a.budget, 120),
      timeline: str(a.timeline, 120),
      locale: str(body.locale, 5),
      utm_content: str(s.utm_content, 150),
      utm_term: str(s.utm_term, 150),
      referrer: str(body.referrer, 300),
      ...clickIds,
    }).filter(([, v]) => v !== null),
  );

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  const salt = process.env.LEADS_IP_SALT || process.env.SUPABASE_SECRET_KEY || "";
  const ipHash = ip ? createHash("sha256").update(`${salt}:${ip}`).digest("hex") : null;

  const supabase = createAdminClient();

  // Reintento del mismo envío (mismo ref) → idempotente
  if (ref) {
    const { data: existing } = await supabase.from("leads").select("id").eq("ref", ref).maybeSingle();
    if (existing) return json({ ok: true }, 200, headers);
  }

  if (ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000).toISOString();
    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT.max) return json({ error: "rate_limited" }, 429, headers);
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      name,
      company: str(a.business, 80),
      message: str(a.notes, 500),
      status: "nuevo",
      source: detectSource(utm.utm_source, clickIds),
      ...utm,
      landing_page: str(body.landing_page, 200),
      next_follow_up: todayISO(),
      form_data: formData,
      ref,
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[leads] insert failed", error.message);
    return json({ error: "server_error" }, 500, headers);
  }

  // Aviso (campana + Telegram) después de responder, para no demorar al visitante
  after(() =>
    notify({
      type: "lead.nuevo",
      title: `Nuevo lead: ${name}${a.business ? ` (${str(a.business, 80)})` : ""}`,
      body: [
        [
          formData.service && `Necesita: ${formData.service}`,
          formData.budget && `Presupuesto: ${formData.budget}`,
          formData.timeline && `Para: ${formData.timeline}`,
        ].filter(Boolean).join(" · "),
        str(a.notes, 500) && `“${str(a.notes, 300)}”`,
        `Origen: ${utm.utm_source ? `${channelFromSource(utm.utm_source, utm.utm_medium ?? "")}${utm.utm_campaign ? ` / ${utm.utm_campaign}` : ""}` : "web (sin UTM)"}${ref ? ` · Ref: ${ref}` : ""}`,
        "Si no te llega su WhatsApp, búscalo por la referencia o escríbele tú.",
      ].filter(Boolean).join("\n"),
      link: `/crm/${lead.id}`,
      data: { lead_id: lead.id, ref },
    }),
  );

  await supabase.from("lead_activities").insert({
    lead_id: lead.id,
    type: "nota",
    content: `Lead recibido desde el formulario de ${formData.locale === "en" ? "la landing (EN)" : "la landing"}. Abrió WhatsApp${ref ? ` con la ref. ${ref}` : ""}.`,
  });

  return json({ ok: true }, 201, headers);
}
