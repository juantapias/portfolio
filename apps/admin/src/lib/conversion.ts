import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSessionBreakdown } from "./analytics";
import { getQuoteTotals } from "./quote-data";
import { getTotals as getInstagramTotals, isInstagramConfigured } from "./social/instagram";
import { isGoogleConfigured } from "./google/client";
import type { Lead, Quote } from "./types";
import { manualRevenueCop, manualSales } from "./clients";

// ─── Canales ───────────────────────────────────────────────────────

export const CHANNELS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook / Meta" },
  { key: "google", label: "Google" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "referido", label: "Referidos" },
  { key: "directo", label: "Directo / sin origen" },
  { key: "otro", label: "Otros" },
] as const;
export type Channel = (typeof CHANNELS)[number]["key"];

/** Canal a partir de fuente/medio (GA4 o UTM del lead) */
export function channelFromSource(source = "", medium = ""): Channel {
  const s = source.toLowerCase();
  const m = medium.toLowerCase();
  if (/(^|[^a-z])(ig|instagram)/.test(s)) return "instagram";
  if (s.includes("tiktok")) return "tiktok";
  if (/(^|[^a-z])(fb|facebook|meta)/.test(s)) return "facebook";
  if (s.includes("google")) return "google";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("whatsapp") || s.includes("wa.me")) return "whatsapp";
  if (s === "(direct)" || s === "" || s === "(not set)") return "directo";
  if (m === "referral") return "referido";
  return "otro";
}

/** Canal de un lead del CRM: manda la UTM; si no hay, el origen elegido a mano */
export function channelFromLead(lead: Pick<Lead, "source" | "utm_source" | "utm_medium">): Channel {
  if (lead.utm_source) return channelFromSource(lead.utm_source, lead.utm_medium ?? "");
  switch (lead.source) {
    case "instagram":
    case "tiktok":
    case "facebook":
    case "google":
    case "linkedin":
    case "whatsapp":
    case "referido":
      return lead.source;
    case "web":
      return "directo";
    default:
      return "otro";
  }
}

const PSEUDO_CAMPAIGNS = new Set(["(not set)", "(direct)", "(organic)", "(referral)", "(none)", ""]);

// ─── Datos del módulo ──────────────────────────────────────────────

export interface Row {
  sessions: number;
  leads: number;
  quotesSent: number;
  won: number;
  wonCop: number;
}
const emptyRow = (): Row => ({ sessions: 0, leads: 0, quotesSent: 0, won: 0, wonCop: 0 });

export async function getConversion(supabase: SupabaseClient, days: number) {
  const now = Date.now();
  const since = new Date(now - days * 864e5).toISOString();
  const prevSince = new Date(now - 2 * days * 864e5).toISOString();
  const inRange = (iso: string | null, from = since, to = new Date(now).toISOString()) => !!iso && iso >= from && iso < to;

  const [ga, ig, leadsRes, clientsRes, quotesRes] = await Promise.allSettled([
    isGoogleConfigured() ? getSessionBreakdown(days) : Promise.reject(new Error("GA4 sin conectar")),
    // La API de Instagram solo acepta ventanas de hasta 30 días
    isInstagramConfigured() && days <= 30 ? getInstagramTotals(days) : Promise.reject(new Error("Solo disponible hasta 28 días")),
    supabase.from("leads").select("id, created_at, source, utm_source, utm_medium, utm_campaign, status").gte("created_at", prevSince),
    // Clientes con cobro registrado a mano (sin importar cuándo llegaron)
    supabase
      .from("leads")
      .select("id, created_at, source, utm_source, utm_medium, utm_campaign, status, delivered_at, paid_amount, paid_fx_rate_cop")
      .eq("status", "ganado")
      .not("paid_amount", "is", null),
    supabase.from("quotes").select("id, lead_id, status, created_at, sent_at, accepted_at, valid_until, currency"),
  ]);

  const leads = (leadsRes.status === "fulfilled" ? leadsRes.value.data ?? [] : []) as Lead[];
  const quotes = (quotesRes.status === "fulfilled" ? quotesRes.value.data ?? [] : []) as Quote[];
  const totals = await getQuoteTotals(supabase, quotes.map((q) => q.id));
  const cop = (q: Quote) => Number(totals.get(q.id)?.total_cop ?? 0);

  // Leads que originaron cada presupuesto (pueden ser anteriores al periodo)
  const leadIds = [...new Set(quotes.map((q) => q.lead_id).filter(Boolean))] as string[];
  const { data: quoteLeads } = leadIds.length
    ? await supabase.from("leads").select("id, created_at, source, utm_source, utm_medium, utm_campaign").in("id", leadIds)
    : { data: [] };
  const leadById = new Map(((quoteLeads ?? []) as Lead[]).map((l) => [l.id, l]));

  const currentLeads = leads.filter((l) => inRange(l.created_at));
  const previousLeads = leads.filter((l) => inRange(l.created_at, prevSince, since));
  const sent = quotes.filter((q) => inRange(q.sent_at));
  const won = quotes.filter((q) => q.status === "aceptado" && inRange(q.accepted_at));
  const prevWon = quotes.filter((q) => q.status === "aceptado" && inRange(q.accepted_at, prevSince, since));

  // Ventas registradas a mano: cuentan por fecha de entrega, solo si no hay presupuesto aceptado
  const clients = (clientsRes.status === "fulfilled" ? clientsRes.value.data ?? [] : []) as Lead[];
  const acceptedLeads = new Set(quotes.filter((q) => q.status === "aceptado" && q.lead_id).map((q) => q.lead_id!));
  const manual = manualSales(clients, acceptedLeads);
  const deliveredIn = (l: Lead, from: string, to: string) => {
    const d = `${l.delivered_at}T12:00:00-05:00`;
    return d >= from && d < to;
  };
  const nowIso = new Date(now).toISOString();
  const manualWon = manual.filter((l) => deliveredIn(l, since, nowIso));
  const manualPrevWon = manual.filter((l) => deliveredIn(l, prevSince, since));

  // ─── Por canal
  const byChannel = new Map<Channel, Row>(CHANNELS.map((c) => [c.key, emptyRow()]));
  const byCampaign = new Map<string, Row>();
  const campaignRow = (name: string) => {
    if (!byCampaign.has(name)) byCampaign.set(name, emptyRow());
    return byCampaign.get(name)!;
  };

  if (ga.status === "fulfilled") {
    for (const r of ga.value.rows) {
      byChannel.get(channelFromSource(r.source, r.medium))!.sessions += r.sessions;
      if (!PSEUDO_CAMPAIGNS.has(r.campaign)) campaignRow(r.campaign).sessions += r.sessions;
    }
  }
  for (const l of currentLeads) {
    byChannel.get(channelFromLead(l))!.leads++;
    if (l.utm_campaign) campaignRow(l.utm_campaign).leads++;
  }
  const attribute = (q: Quote, apply: (row: Row) => void) => {
    const lead = q.lead_id ? leadById.get(q.lead_id) : undefined;
    apply(byChannel.get(lead ? channelFromLead(lead) : "otro")!);
    if (lead?.utm_campaign) apply(campaignRow(lead.utm_campaign));
  };
  for (const q of sent) attribute(q, (r) => r.quotesSent++);
  for (const q of won) attribute(q, (r) => { r.won++; r.wonCop += cop(q); });
  for (const l of manualWon) {
    const apply = (r: Row) => { r.won++; r.wonCop += manualRevenueCop(l); };
    apply(byChannel.get(channelFromLead(l))!);
    if (l.utm_campaign) apply(campaignRow(l.utm_campaign));
  }

  // ─── Velocidad de cierre: días entre la creación del lead y la aceptación
  const closeDays = won
    .map((q) => {
      const lead = q.lead_id ? leadById.get(q.lead_id) : undefined;
      return lead && q.accepted_at ? (new Date(q.accepted_at).getTime() - new Date(lead.created_at).getTime()) / 864e5 : null;
    })
    .filter((d): d is number => d !== null)
    .concat(manualWon.map((l) => (new Date(`${l.delivered_at}T12:00:00-05:00`).getTime() - new Date(l.created_at).getTime()) / 864e5));

  const sessions = ga.status === "fulfilled" ? ga.value : null;
  const wonCop = won.reduce((s, q) => s + cop(q), 0) + manualWon.reduce((s, l) => s + manualRevenueCop(l), 0);
  const wonCount = won.length + manualWon.length;

  return {
    sources: {
      ga: ga.status === "fulfilled" ? null : (ga.reason as Error).message,
      instagram: ig.status === "fulfilled" ? null : (ig.reason as Error).message,
    },
    funnel: {
      reach: ig.status === "fulfilled" ? ig.value.current.reach : null,
      profileViews: ig.status === "fulfilled" ? ig.value.current.profile_views : null,
      sessions: sessions?.current ?? null,
      leads: currentLeads.length,
      quotesSent: sent.length,
      won: wonCount,
      wonCop,
    },
    previous: {
      sessions: sessions?.previous ?? null,
      leads: previousLeads.length,
      won: prevWon.length + manualPrevWon.length,
      wonCop: prevWon.reduce((s, q) => s + cop(q), 0) + manualPrevWon.reduce((s, l) => s + manualRevenueCop(l), 0),
    },
    avgDeal: wonCount ? wonCop / wonCount : null,
    avgCloseDays: closeDays.length ? closeDays.reduce((a, b) => a + b, 0) / closeDays.length : null,
    channels: CHANNELS.map((c) => ({ ...c, ...byChannel.get(c.key)! })).filter((c) => c.sessions || c.leads || c.quotesSent || c.won),
    campaigns: [...byCampaign.entries()]
      .map(([name, row]) => ({ name, ...row }))
      .sort((a, b) => b.leads - a.leads || b.sessions - a.sessions)
      .slice(0, 15),
  };
}
