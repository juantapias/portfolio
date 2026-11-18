import { CalendarX2, Clapperboard, Globe, Heart, Info, MessageCircle, Music2, Play, Plug, RefreshCw, Share2, Users } from "lucide-react";
import { Card, Stat, surfaceClass } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/form";
import { LineChart } from "@/components/charts/line-chart";
import { createClient } from "@/lib/supabase/server";
import { getSocialTraffic } from "@/lib/analytics";
import { isGoogleConfigured } from "@/lib/google/client";
import { getConnection, getUser, getVideos, isTikTokConfigured, type TtVideo } from "@/lib/social/tiktok";
import { daysAgoISO, formatDate, todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Callout, MediaMetric, ProfileHeader, SectionError, n, type Range } from "./shared";

export async function TikTokTab({ range }: { range: Range }) {
  if (!isTikTokConfigured()) {
    return (
      <EmptyState icon={Music2} title="TikTok está pendiente de configurar" description="Faltan TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET y TIKTOK_REDIRECT_URI." />
    );
  }
  const connection = await getConnection();
  if (!connection) {
    return (
      <EmptyState
        icon={Plug}
        title="TikTok aún no está conectado"
        description="Autoriza tu cuenta una vez y el admin mantendrá la conexión renovándola sola."
        action={
          <a href="/api/integrations/tiktok/connect" className={buttonClass()}>
            <Plug aria-hidden className="size-4" />
            Conectar TikTok
          </a>
        }
      />
    );
  }

  const supabase = await createClient();
  const [user, videos, history, traffic] = await Promise.allSettled([
    getUser(),
    getVideos(40),
    supabase
      .from("social_metrics_daily")
      .select("date, followers")
      .eq("provider", "tiktok")
      .order("date")
      .then(({ data }) => (data ?? []) as { date: string; followers: number | null }[]),
    isGoogleConfigured() ? getSocialTraffic(range) : Promise.reject(new Error("GA4 sin conectar")),
  ]);

  if (user.status === "rejected") {
    return (
      <div className="space-y-3">
        <SectionError reason={user.reason} />
        <a href="/api/integrations/tiktok/connect" className={buttonClass("secondary")}>
          <RefreshCw aria-hidden className="size-4" />
          Reconectar TikTok
        </a>
      </div>
    );
  }

  const u = user.value;
  const since = new Date(daysAgoISO(range)).getTime() / 1000;
  const all = videos.status === "fulfilled" ? videos.value : [];
  const inRange = all.filter((v) => v.create_time >= since);
  const byViews = (list: TtVideo[]) => [...list].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0)).slice(0, 8);
  // Si no hubo videos en el periodo, se muestran los más vistos de siempre
  const recent = inRange.length > 0;
  const top = byViews(recent ? inRange : all);
  const lastPost = all.length ? Math.max(...all.map((v) => v.create_time)) : null;
  const daysSinceLast = lastPost ? Math.floor((new Date(todayISO()).getTime() / 1000 - lastPost) / 86400) : null;
  const rangeViews = inRange.reduce((s, v) => s + (v.view_count ?? 0), 0);
  const followerHistory = history.status === "fulfilled" ? history.value.filter((h) => h.followers != null) : [];
  const past = followerHistory.find((h) => h.date >= daysAgoISO(range).slice(0, 10));

  return (
    <div className="space-y-4">
      <div className={cn(surfaceClass, "p-4")}>
        <ProfileHeader
          network="TikTok"
          icon={Music2}
          avatar={u.avatar_url}
          handle={u.username ? `@${u.username}` : u.display_name}
          href={u.profile_deep_link ?? `https://www.tiktok.com/@${u.username}`}
          meta={`${n(u.video_count)} videos`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat highlight icon={Users} label="Seguidores" value={n(u.follower_count)} info="Total actual de seguidores de la cuenta.">
          {past?.followers != null && past.date !== todayISO() ? (
            <Delta current={u.follower_count} previous={past.followers} />
          ) : (
            <span className="text-xs text-muted-foreground">La comparación aparece cuando haya historial</span>
          )}
        </Stat>
        <Stat
          icon={Play}
          label="Vistas de videos nuevos"
          value={n(rangeViews)}
          info="Vistas acumuladas de los videos publicados en el periodo."
          hint={`${inRange.length} video${inRange.length === 1 ? "" : "s"} en ${range} días`}
        />
        <Stat icon={Heart} label="Me gusta" value={n(u.likes_count)} info="Total acumulado de me gusta del perfil." hint="Acumulado del perfil" />
        <Stat
          icon={Globe}
          label="De TikTok a tu web"
          value={traffic.status === "fulfilled" ? n(traffic.value.tiktok.sessions) : "—"}
          info="Sesiones en juantapias.dev que llegaron desde TikTok, según GA4."
          hint={traffic.status === "fulfilled" ? `sesiones · ${n(traffic.value.tiktok.leads)} leads` : "GA4 sin datos"}
        />
      </div>

      {followerHistory.length >= 2 && (
        <Card title="Seguidores (historial)" icon={Users} info="Total de seguidores según la copia diaria que guarda el admin.">
          <LineChart label="Seguidores" data={followerHistory.map((h) => ({ date: h.date, value: h.followers! }))} />
        </Card>
      )}

      <Card
        title={recent ? `Mejores videos · ${range} días` : "Tus videos más vistos"}
        icon={Clapperboard}
        info="TikTok solo entrega totales acumulados por video (no alcance por día), por eso se ordenan por vistas totales."
      >
        {!recent && daysSinceLast != null && (
          <div className="mb-4">
            <Callout icon={CalendarX2}>
              No has publicado en TikTok en los últimos {range} días. Tu último video fue hace{" "}
              <span className="font-semibold">{daysSinceLast} días</span>
              {lastPost && <> ({formatDate(new Date(lastPost * 1000).toISOString())})</>}. Estos son tus más vistos de siempre.
            </Callout>
          </div>
        )}
        {videos.status === "rejected" ? (
          <SectionError reason={videos.reason} />
        ) : top.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {top.map((v) => <VideoCard key={v.id} video={v} />)}
          </ul>
        ) : (
          <EmptyState icon={Clapperboard} title="Todavía no hay videos" description="Cuando publiques en TikTok, tus videos aparecerán aquí." />
        )}
      </Card>

      {traffic.status === "rejected" && (
        <Callout icon={Info} tone="info">
          El tráfico a la web no está disponible: {traffic.reason instanceof Error ? traffic.reason.message : String(traffic.reason)}
        </Callout>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: TtVideo }) {
  return (
    <li className="flex flex-col">
      <a
        href={video.share_url}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-border bg-muted">
          {video.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.cover_image_url}
              alt={video.title?.slice(0, 80) ?? ""}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
            />
          )}
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-8 pb-2 text-sm font-medium text-white tabular-nums">
            <Play aria-hidden className="size-4 fill-current" />
            {video.view_count == null ? "—" : n(video.view_count)}
            <span className="sr-only">vistas</span>
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground group-hover:text-foreground">
          {video.title || video.video_description || "Sin texto"}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/80">{formatDate(new Date(video.create_time * 1000).toISOString())}</p>
      </a>
      <dl className="mt-2.5 grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-border pt-2.5 text-xs">
        <MediaMetric icon={Heart} label="Me gusta" value={video.like_count} />
        <MediaMetric icon={MessageCircle} label="Comentarios" value={video.comment_count} />
        <MediaMetric icon={Share2} label="Compartidos" value={video.share_count} />
      </dl>
    </li>
  );
}

