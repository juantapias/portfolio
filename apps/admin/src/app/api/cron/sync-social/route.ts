import { createAdminClient } from "@/lib/supabase/server";
import { getProfile, getTotals, isInstagramConfigured } from "@/lib/social/instagram";
import { getConnection, getUser, getVideos, isTikTokConfigured } from "@/lib/social/tiktok";
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

  if (isTikTokConfigured() && (await getConnection())) {
    try {
      // getUser renueva el access token (24 h) si hace falta
      const [user, videos] = await Promise.all([getUser(), getVideos(40)]);
      const views = videos.reduce((s, v) => s + (v.view_count ?? 0), 0);
      const { error } = await supabase.from("social_metrics_daily").upsert({
        provider: "tiktok",
        date: todayISO(),
        followers: user.follower_count,
        views, // vistas acumuladas de los últimos 40 videos
        interactions: user.likes_count, // "me gusta" totales del perfil
        raw: { user, videos: videos.length },
      });
      if (videos.length) {
        await supabase.from("social_posts").upsert(
          videos.map((v) => ({
            provider: "tiktok",
            external_id: v.id,
            posted_at: new Date(v.create_time * 1000).toISOString(),
            media_type: "VIDEO",
            caption: v.title || v.video_description || null,
            permalink: v.share_url ?? null,
            thumbnail: v.cover_image_url ?? null,
            views: v.view_count ?? null,
            likes: v.like_count ?? null,
            comments: v.comment_count ?? null,
            shares: v.share_count ?? null,
            updated_at: new Date().toISOString(),
          })),
        );
      }
      results.tiktok = error ? { error: error.message } : { ok: true, followers: user.follower_count };
    } catch (e) {
      results.tiktok = { error: (e as Error).message };
    }
  }

  const failed = Object.values(results).some((r) => (r as { error?: string }).error);
  return Response.json(results, { status: failed ? 500 : 200 });
}
