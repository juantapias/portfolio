import { syncSocial } from "@/lib/jobs/social-sync";
import { sendDailyReminders } from "@/lib/jobs/reminders";
import { notify } from "@/lib/notifications";

/**
 * Trabajo diario (Vercel Cron, 6 a. m. Colombia): copia de métricas de redes
 * + avisos de la mañana. Vercel envía `Authorization: Bearer <CRON_SECRET>`.
 */
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const social = await syncSocial();
  const failures = Object.entries(social).filter(([, r]) => (r as { error?: string }).error);
  if (failures.length) {
    await notify({
      type: "sistema.error",
      title: `Falló la sincronización de ${failures.map(([k]) => (k === "instagram" ? "Instagram" : "TikTok")).join(" y ")}`,
      body: failures.map(([k, r]) => `${k}: ${(r as { error: string }).error}`).join("\n"),
      link: "/ajustes",
      data: { social },
    });
  }

  const reminders = await sendDailyReminders();
  return Response.json({ social, reminders }, { status: failures.length ? 500 : 200 });
}
