import { createAdminClient } from "@/lib/supabase/server";
import { getProfile, getTotals, isInstagramConfigured } from "@/lib/social/instagram";
import { todayISO } from "@/lib/format";

/**
 * Copia diaria de métricas de redes en `social_metrics_daily`.
 * La ejecuta Vercel Cron (ver vercel.json), que envía `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results: Record<string, unknown> = {};

  if (isInstagramConfigured()) {
    try {
      const [profile, day] = await Promise.all([getProfile(), getTotals(1)]);
      const { error } = await supabase.from("social_metrics_daily").upsert({
        provider: "instagram",
        date: todayISO(),
        followers: profile.followers_count,
        // Métricas de las últimas 24 h
        reach: day.current.reach,
        views: day.current.views,
        profile_views: day.current.profile_views,
        interactions: day.current.total_interactions,
        raw: { profile, last24h: day.current },
      });
      results.instagram = error ? { error: error.message } : { ok: true, followers: profile.followers_count };
    } catch (e) {
      results.instagram = { error: (e as Error).message };
    }
  }

  const failed = Object.values(results).some((r) => (r as { error?: string }).error);
  return Response.json(results, { status: failed ? 500 : 200 });
}
