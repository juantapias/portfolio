import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

// ─── Tipos de evento ───────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  "lead.nuevo": { label: "Lead nuevo", description: "Alguien envió el formulario de la web", icon: "🔔" },
  "presupuesto.visto": { label: "Presupuesto visto", description: "Un cliente abrió el enlace de su presupuesto", icon: "👀" },
  "seguimiento.hoy": { label: "Seguimientos del día", description: "Resumen de las 7 a. m. con los leads a contactar", icon: "📋" },
  "presupuesto.vence": { label: "Presupuesto por vencer", description: "Un presupuesto enviado vence mañana", icon: "⏳" },
  "sistema.error": { label: "Problemas de conexión", description: "Falló la sincronización con Instagram o TikTok, o una conexión está por vencer", icon: "⚠️" },
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;

export interface NotifyInput {
  type: NotificationType;
  title: string;
  body?: string;
  /** Ruta del admin (p. ej. /crm/<id>) */
  link?: string;
  data?: Record<string, unknown>;
}

// ─── Telegram ──────────────────────────────────────────────────────

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/** Escapa texto para parse_mode=HTML (los datos vienen de formularios públicos) */
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ADMIN_URL = process.env.ADMIN_URL ?? "https://admin.juantapias.dev";

export async function sendTelegram(input: Pick<NotifyInput, "type" | "title" | "body" | "link">) {
  const icon = NOTIFICATION_TYPES[input.type]?.icon ?? "🔔";
  const lines = [`${icon} <b>${esc(input.title)}</b>`];
  if (input.body) lines.push(esc(input.body));
  if (input.link) lines.push(`<a href="${ADMIN_URL}${input.link}">Abrir en el admin →</a>`);

  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: lines.join("\n\n").slice(0, 4000),
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(json.description ?? `Telegram ${res.status}`);
}

// ─── Notificar ─────────────────────────────────────────────────────

/**
 * Guarda la notificación (campana del admin) y la envía a Telegram si está
 * configurado y el tipo no está desactivado. Nunca lanza: un aviso fallido no
 * debe romper el flujo que lo originó (p. ej. guardar un lead).
 */
export async function notify(input: NotifyInput) {
  const supabase = createAdminClient();
  let telegram: string | null = null;

  if (isTelegramConfigured()) {
    const { data: setting } = await supabase
      .from("notification_settings")
      .select("telegram")
      .eq("type", input.type)
      .maybeSingle();
    if (setting && setting.telegram === false) {
      telegram = "desactivado";
    } else {
      try {
        await sendTelegram(input);
        telegram = "enviado";
      } catch (e) {
        telegram = `error: ${(e as Error).message}`.slice(0, 200);
        console.error("[notify] telegram", telegram);
      }
    }
  }

  const { error } = await supabase.from("notifications").insert({
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    link: input.link ?? null,
    data: input.data ?? null,
    telegram,
  });
  if (error) console.error("[notify] insert", error.message);
}
