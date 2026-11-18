import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { EmptyState } from "@/components/ui/empty-state";
import { LineChart } from "@/components/charts/line-chart";
import { createClient } from "@/lib/supabase/server";
import { getSocialTraffic } from "@/lib/analytics";
import { isGoogleConfigured } from "@/lib/google/client";
import {
  getDaily,
  getProfile,
  getTopPosts,
  getTotals,
  isInstagramConfigured,
  type IgPost,
  type IgTotals,
} from "@/lib/social/instagram";
import { getConnection, getUser, getVideos, isTikTokConfigured, type TtVideo } from "@/lib/social/tiktok";
import { buttonClass } from "@/components/ui/form";
import { daysAgoISO, formatDate, todayISO } from "@/lib/format";

export const metadata: Metadata = { title: "Redes sociales" };

// La API de Instagram limita las estadísticas de cuenta a ventanas de 30 días
const RANGES = [7, 28] as const;
type Range = (typeof RANGES)[number];

const n = (v: number) => v.toLocaleString("es-CO");

export default async function SocialPage({ searchParams }: PageProps<"/redes">) {
  const r = Number((await searchParams).rango);
  const range: Range = RANGES.includes(r as Range) ? (r as Range) : 28;

  return (
    <>
      <PageHeader
        title="Redes sociales"
        description="Instagram y TikTok"
        actions={
          <nav aria-label="Periodo" className="flex rounded-md border border-border bg-surface p-0.5 text-sm">
            {RANGES.map((v) => (
              <Link
                key={v}
                href={`/redes?rango=${v}`}
                aria-current={v === range ? "page" : undefined}
                className={`rounded px-3 py-1.5 ${v === range ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
              >
                {v} días
              </Link>
            ))}
          </nav>
        }
      />

      {isInstagramConfigured() ? (
        <InstagramSection range={range} />
      ) : (
        <EmptyState title="Instagram no está conectado" description="Faltan INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID." />
      )}

      <TikTokSection range={range} />
    </>
  );
}

async function InstagramSection({ range }: { range: Range }) {
  const supabase = await createClient();
  const [profile, totals, reach, follows, posts, traffic, history] = await Promise.allSettled([
    getProfile(),
    getTotals(range),
    getDaily("reach", range),
    getDaily("follower_count", range),
    getTopPosts(range),
    isGoogleConfigured() ? getSocialTraffic(range) : Promise.reject(new Error("GA4 sin conectar")),
    supabase
      .from("social_metrics_daily")
      .select("date, followers")
      .eq("provider", "instagram")
      .order("date")
      .then(({ data }) => (data ?? []) as { date: string; followers: number | null }[]),
  ]);

  if (profile.status === "rejected") return <SectionError reason={profile.reason} />;
  const p = profile.value;
  const newFollowers = follows.status === "fulfilled" ? follows.value.reduce((s, d) => s + d.value, 0) : null;
  const followerHistory = history.status === "fulfilled" ? history.value.filter((h) => h.followers != null) : [];

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        {p.profile_picture_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profile_picture_url} alt="" referrerPolicy="no-referrer" className="size-10 rounded-full border border-border" />
        )}
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Instagram</h2>
          <a href={`https://www.instagram.com/${p.username}/`} target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-accent">
            @{p.username} · {n(p.media_count)} publicaciones
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Seguidores</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{n(p.followers_count)}</p>
          <p className="mt-1 text-xs text-muted">
            {newFollowers === null ? "—" : `+${n(newFollowers)} nuevos en ${range} días`}
          </p>
        </Card>
        {totals.status === "fulfilled" ? (
          (
            [
              ["Alcance", "reach", "Cuentas únicas que vieron tu contenido"],
              ["Vistas", "views", "Reproducciones y visualizaciones"],
              ["Interacciones", "total_interactions", "Me gusta, comentarios, guardados y compartidos"],
            ] as [string, keyof IgTotals, string][]
          ).map(([label, key, title]) => (
            <Card key={key}>
              <p className="text-sm text-muted" title={title}>{label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{n(totals.value.current[key])}</p>
              <p className="mt-1">
                <Delta current={totals.value.current[key]} previous={totals.value.previous[key]} />
              </p>
            </Card>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3"><SectionError reason={totals.reason} /></div>
        )}
      </div>

      {totals.status === "fulfilled" && (
        <dl className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-4">
          {(
            [
              ["Visitas al perfil", "profile_views"],
              ["Cuentas que interactuaron", "accounts_engaged"],
              ["Guardados", "saves"],
              ["Compartidos", "shares"],
            ] as [string, keyof IgTotals][]
          ).map(([label, key]) => (
            <div key={key}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-0.5 font-semibold tabular-nums">
                {n(totals.value.current[key])}{" "}
                <Delta current={totals.value.current[key]} previous={totals.value.previous[key]} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Alcance por día">
          {reach.status === "fulfilled" ? <LineChart label="Alcance" data={reach.value} width={460} /> : <SectionError reason={reach.reason} />}
        </Card>
        <Card title={followerHistory.length >= 2 ? "Seguidores (historial)" : "Nuevos seguidores por día"}>
          {followerHistory.length >= 2 ? (
            <LineChart label="Seguidores" data={followerHistory.map((h) => ({ date: h.date, value: h.followers! }))} width={460} />
          ) : follows.status === "fulfilled" ? (
            <>
              <LineChart label="Nuevos seguidores" data={follows.value} width={460} />
              <p className="mt-2 text-xs text-muted">
                El historial del total de seguidores se construye con una copia diaria; aparecerá aquí desde mañana.
              </p>
            </>
          ) : (
            <SectionError reason={follows.reason} />
          )}
        </Card>
      </div>

      <Card title={`Mejores publicaciones (${range} días)`} className="mt-6">
        {posts.status === "fulfilled" ? (
          posts.value.top.length ? (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {posts.value.top.map((post) => <PostCard key={post.id} post={post} />)}
              </ul>
              <p className="mt-3 text-xs text-muted">{posts.value.count} publicaciones en el periodo · ordenadas por vistas</p>
            </>
          ) : (
            <p className="text-sm text-muted">Sin publicaciones en este periodo.</p>
          )
        ) : (
          <SectionError reason={posts.reason} />
        )}
      </Card>

      <Card title="De Instagram a tu web" className="mt-6">
        {traffic.status === "fulfilled" ? (
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-xs text-muted">Sesiones en juantapias.dev</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{n(traffic.value.instagram.sessions)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Leads (formulario / WhatsApp)</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{n(traffic.value.instagram.leads)}</p>
            </div>
            {totals.status === "fulfilled" && totals.value.current.profile_views > 0 && (
              <div>
                <p className="text-xs text-muted">Visitas al perfil → sesiones web</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {((traffic.value.instagram.sessions / totals.value.current.profile_views) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%
                </p>
              </div>
            )}
            <p className="w-full text-xs text-muted">Según GA4 (solo visitantes que aceptan cookies). Usa el enlace juantapias.dev/ig en tu bio para que se atribuya bien.</p>
          </div>
        ) : (
          <SectionError reason={traffic.reason} />
        )}
      </Card>
    </section>
  );
}

async function TikTokSection({ range }: { range: Range }) {
  const header = <h2 className="mb-4 text-lg font-semibold tracking-tight">TikTok</h2>;

  if (!isTikTokConfigured()) {
    return (
      <section className="mt-12">
        {header}
        <EmptyState title="Pendiente de configurar" description="Faltan TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET y TIKTOK_REDIRECT_URI." />
      </section>
    );
  }
  const connection = await getConnection();
  if (!connection) {
    return (
      <section className="mt-12">
        {header}
        <EmptyState
          title="TikTok aún no está conectado"
          description="Autoriza tu cuenta una vez y el admin mantendrá la conexión renovándola sola."
          action={<a href="/api/integrations/tiktok/connect" className={buttonClass()}>Conectar TikTok</a>}
        />
      </section>
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
      <section className="mt-12">
        {header}
        <SectionError reason={user.reason} />
        <a href="/api/integrations/tiktok/connect" className={buttonClass("secondary", "mt-3")}>Reconectar TikTok</a>
      </section>
    );
  }
  const u = user.value;
  const since = new Date(daysAgoISO(range)).getTime() / 1000;
  const inRange = videos.status === "fulfilled" ? videos.value.filter((v) => v.create_time >= since) : [];
  const all = videos.status === "fulfilled" ? videos.value : [];
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
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        {u.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.avatar_url} alt="" referrerPolicy="no-referrer" className="size-10 rounded-full border border-border" />
        )}
        <div>
          <h2 className="text-lg font-semibold tracking-tight">TikTok</h2>
          <a href={u.profile_deep_link ?? `https://www.tiktok.com/@${u.username}`} target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-accent">
            {u.username ? `@${u.username}` : u.display_name} · {n(u.video_count)} videos
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Seguidores</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{n(u.follower_count)}</p>
          <p className="mt-1">
            {past?.followers != null && past.date !== todayISO() ? (
              <Delta current={u.follower_count} previous={past.followers} />
            ) : (
              <span className="text-xs text-muted">La comparación aparece cuando haya historial</span>
            )}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted" title="Vistas acumuladas de los videos publicados en el periodo">Vistas de videos nuevos</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{n(rangeViews)}</p>
          <p className="mt-1 text-xs text-muted">{inRange.length} video{inRange.length === 1 ? "" : "s"} en {range} días</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Me gusta (total)</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{n(u.likes_count)}</p>
          <p className="mt-1 text-xs text-muted">Acumulado del perfil</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">De TikTok a tu web</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {traffic.status === "fulfilled" ? n(traffic.value.tiktok.sessions) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {traffic.status === "fulfilled" ? `sesiones · ${n(traffic.value.tiktok.leads)} leads (GA4)` : "GA4 sin datos"}
          </p>
        </Card>
      </div>

      {followerHistory.length >= 2 && (
        <Card title="Seguidores (historial)" className="mt-6">
          <LineChart label="Seguidores" data={followerHistory.map((h) => ({ date: h.date, value: h.followers! }))} />
        </Card>
      )}

      <Card title={recent ? `Mejores videos (${range} días)` : "Tus videos más vistos"} className="mt-6">
        {!recent && daysSinceLast != null && (
          <p className="mb-4 rounded-md border border-border bg-background px-3 py-2 text-sm">
            No has publicado en TikTok en los últimos {range} días. Tu último video fue hace{" "}
            <span className="font-semibold">{daysSinceLast} días</span>
            {lastPost && <> ({formatDate(new Date(lastPost * 1000).toISOString())})</>}. Estos son tus más vistos de siempre.
          </p>
        )}
        {videos.status === "rejected" ? (
          <SectionError reason={videos.reason} />
        ) : top.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {top.map((v) => <VideoCard key={v.id} video={v} />)}
          </ul>
        ) : (
          <p className="text-sm text-muted">Todavía no hay videos en la cuenta.</p>
        )}
        <p className="mt-3 text-xs text-muted">
          TikTok solo entrega totales acumulados por video (no alcance por día), por eso se ordenan por vistas totales.
        </p>
      </Card>
    </section>
  );
}

function VideoCard({ video }: { video: TtVideo }) {
  return (
    <li>
      <a href={video.share_url} target="_blank" rel="noreferrer" className="group block">
        <div className="relative aspect-[9/16] overflow-hidden rounded-md border border-border bg-background">
          {video.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={video.cover_image_url} alt={video.title?.slice(0, 80) ?? ""} referrerPolicy="no-referrer" loading="lazy" className="size-full object-cover transition group-hover:scale-[1.02]" />
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted">{video.title || video.video_description || "Sin texto"}</p>
        <p className="mt-1 text-xs text-muted">{formatDate(new Date(video.create_time * 1000).toISOString())}</p>
      </a>
      <dl className="mt-2 grid grid-cols-2 gap-1 text-xs">
        <Metric label="Vistas" value={video.view_count} />
        <Metric label="Me gusta" value={video.like_count} />
        <Metric label="Coment." value={video.comment_count} />
        <Metric label="Compart." value={video.share_count} />
      </dl>
    </li>
  );
}

const TYPES: Record<string, string> = { REELS: "Reel", FEED: "Post", STORY: "Historia", CAROUSEL_ALBUM: "Carrusel" };

function PostCard({ post }: { post: IgPost }) {
  const thumb = post.thumbnail_url ?? post.media_url;
  const kind = post.media_type === "CAROUSEL_ALBUM" ? "Carrusel" : (TYPES[post.media_product_type] ?? post.media_type);
  const i = post.insights;
  return (
    <li>
      <a href={post.permalink} target="_blank" rel="noreferrer" className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-background">
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={post.caption?.slice(0, 80) ?? ""} referrerPolicy="no-referrer" loading="lazy" className="size-full object-cover transition group-hover:scale-[1.02]" />
          )}
          <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">{kind}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted">{post.caption ?? "Sin texto"}</p>
        <p className="mt-1 text-xs text-muted">{formatDate(post.timestamp)}</p>
      </a>
      <dl className="mt-2 grid grid-cols-3 gap-1 text-xs">
        <Metric label="Vistas" value={i?.views} />
        <Metric label="Alcance" value={i?.reach} />
        <Metric label="Interacc." value={i?.total_interactions} />
        <Metric label="Guardados" value={i?.saved} />
        <Metric label="Compart." value={i?.shares} />
        <Metric label="Coment." value={post.comments_count} />
      </dl>
    </li>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium tabular-nums">{value == null ? "—" : n(value)}</dd>
    </div>
  );
}

function SectionError({ reason }: { reason: unknown }) {
  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
      No se pudo cargar: {reason instanceof Error ? reason.message : String(reason)}
    </p>
  );
}
