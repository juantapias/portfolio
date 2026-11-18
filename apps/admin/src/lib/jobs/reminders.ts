import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { getConnection, isTikTokConfigured } from "@/lib/social/tiktok";
import { notify } from "@/lib/notifications";
import { formatDate, todayISO } from "@/lib/format";

/** Avisos de la mañana: seguimientos del día, presupuestos que vencen mañana y conexiones por vencer. */
export async function sendDailyReminders() {
  const supabase = createAdminClient();
  const today = todayISO();
  const tomorrow = new Date(new Date(`${today}T12:00:00`).getTime() + 864e5).toISOString().slice(0, 10);
  const sent: string[] = [];

  // ─── Seguimientos para hoy o atrasados (leads abiertos)
  const { data: due } = await supabase
    .from("leads")
    .select("id, name, company, next_follow_up, status")
    .lte("next_follow_up", today)
    .not("status", "in", "(ganado,perdido)")
    .order("next_follow_up");
  if (due?.length) {
    const lines = due.slice(0, 10).map((l) => {
      const late = l.next_follow_up < today ? ` (atrasado desde ${formatDate(l.next_follow_up)})` : "";
      return `• ${l.name}${l.company ? ` · ${l.company}` : ""}${late}`;
    });
    if (due.length > 10) lines.push(`… y ${due.length - 10} más`);
    await notify({
      type: "seguimiento.hoy",
      title: `${due.length} seguimiento${due.length === 1 ? "" : "s"} para hoy`,
      body: lines.join("\n"),
      link: "/",
      data: { lead_ids: due.map((l) => l.id) },
    });
    sent.push("seguimiento.hoy");
  }

  // ─── Presupuestos enviados que vencen mañana
  const { data: expiring } = await supabase
    .from("quotes")
    .select("id, number, title, lead_id, view_count")
    .eq("status", "enviado")
    .eq("valid_until", tomorrow);
  for (const q of expiring ?? []) {
    await notify({
      type: "presupuesto.vence",
      title: `El presupuesto ${q.number} vence mañana`,
      body: `${q.title}${q.view_count ? ` · El cliente lo abrió ${q.view_count} ${q.view_count === 1 ? "vez" : "veces"}` : " · El cliente aún no lo ha abierto"}. Escríbele o extiende la validez.`,
      link: `/presupuestos/${q.id}`,
      data: { quote_id: q.id },
    });
    sent.push(`presupuesto.vence:${q.number}`);
  }

  // ─── Conexión de TikTok por vencer (refresh token de 365 días)
  if (isTikTokConfigured()) {
    const tiktok = await getConnection();
    if (tiktok) {
      const daysLeft = Math.floor((new Date(tiktok.refresh_expires_at).getTime() - Date.now()) / 864e5);
      if ([14, 7, 1].includes(daysLeft)) {
        await notify({
          type: "sistema.error",
          title: `La conexión con TikTok vence en ${daysLeft} día${daysLeft === 1 ? "" : "s"}`,
          body: "Entra a Ajustes y pulsa «Reconectar» para que las métricas sigan llegando.",
          link: "/ajustes",
        });
        sent.push("tiktok.vence");
      }
    }
  }

  return sent;
}
