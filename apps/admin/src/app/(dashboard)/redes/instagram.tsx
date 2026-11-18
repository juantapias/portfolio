import {
  Bookmark,
  Camera,
  Eye,
  Film,
  Globe,
  Heart,
  Image as ImageIcon,
  Images,
  MessageCircle,
  MousePointerClick,
  Play,
  Radar,
  Share2,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Card, Stat, surfaceClass } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { EmptyState } from "@/components/ui/empty-state";
import { LineChart } from "@/components/charts/line-chart";
import { createClient } from "@/lib/supabase/server";
import { getSocialTraffic } from "@/lib/analytics";
import { isGoogleConfigured } from "@/lib/google/client";
import { getDaily, getProfile, getTopPosts, getTotals, isInstagramConfigured, type IgPost, type IgTotals } from "@/lib/social/instagram";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MediaMetric, MiniStat, ProfileHeader, SectionError, n, type Range } from "./shared";

export async function InstagramTab({ range }: { range: Range }) {
  if (!isInstagramConfigured()) {
    return <EmptyState icon={Camera} title="Instagram no está conectado" description="Faltan INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID." />;
  }

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
  const t = totals.status === "fulfilled" ? totals.value : null;

  const kpis: { key: keyof IgTotals; label: string; icon: typeof Eye; info: string }[] = [
    { key: "reach", label: "Alcance", icon: Radar, info: "Cuentas únicas que vieron tu contenido en el periodo." },
    { key: "views", label: "Vistas", icon: Play, info: "Reproducciones y visualizaciones de tus publicaciones." },
    { key: "total_interactions", label: "Interacciones", icon: Sparkles, info: "Me gusta, comentarios, guardados y compartidos." },
  ];
  const secondary: { key: keyof IgTotals; label: string; icon: typeof Eye }[] = [
    { key: "profile_views", label: "Visitas al perfil", icon: UserRound },
    { key: "accounts_engaged", label: "Cuentas que interactuaron", icon: UserCheck },
    { key: "saves", label: "Guardados", icon: Bookmark },
    { key: "shares", label: "Compartidos", icon: Share2 },
  ];

  return (
    <div className="space-y-4">
      <div className={cn(surfaceClass, "p-4")}>
        <ProfileHeader
          network="Instagram"
          icon={Camera}
          avatar={p.profile_picture_url}
          handle={`@${p.username}`}
          href={`https://www.instagram.com/${p.username}/`}
          meta={`${n(p.media_count)} publicaciones`}
        />
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat
          highlight
          icon={Users}
          label="Seguidores"
          value={n(p.followers_count)}
          info="Total actual de seguidores de la cuenta."
          hint={newFollowers === null ? undefined : `+${n(newFollowers)} nuevos en ${range} días`}
        />
        {t
          ? kpis.map((k) => (
              <Stat key={k.key} icon={k.icon} label={k.label} value={n(t.current[k.key])} info={k.info}>
                <Delta current={t.current[k.key]} previous={t.previous[k.key]} />
              </Stat>
            ))
          : totals.status === "rejected" && (
              <div className="sm:col-span-2 xl:col-span-3">
                <SectionError reason={totals.reason} />
              </div>
            )}
      </div>

      {/* Métricas secundarias */}
      {t && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {secondary.map((s) => (
            <MiniStat key={s.key} icon={s.icon} label={s.label} value={n(t.current[s.key])}>
              <Delta current={t.current[s.key]} previous={t.previous[s.key]} />
            </MiniStat>
          ))}
        </div>
      )}

      {/* Tendencias */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Alcance por día" icon={TrendingUp} info="Cuentas únicas alcanzadas cada día.">
          {reach.status === "fulfilled" ? <LineChart label="Alcance" data={reach.value} width={460} /> : <SectionError reason={reach.reason} />}
        </Card>
        <Card
          title={followerHistory.length >= 2 ? "Seguidores (historial)" : "Nuevos seguidores por día"}
          icon={Users}
          info={
            followerHistory.length >= 2
              ? "Total de seguidores según la copia diaria que guarda el admin."
              : "El historial del total se construye con una copia diaria y aparecerá cuando haya al menos dos días."
          }
        >
          {followerHistory.length >= 2 ? (
            <LineChart label="Seguidores" data={followerHistory.map((h) => ({ date: h.date, value: h.followers! }))} width={460} />
          ) : follows.status === "fulfilled" ? (
            <LineChart label="Nuevos seguidores" data={follows.value} width={460} />
          ) : (
            <SectionError reason={follows.reason} />
          )}
        </Card>
      </div>

      {/* Publicaciones */}
      <Card
        title={`Mejores publicaciones · ${range} días`}
        icon={ImageIcon}
        info="Publicaciones del periodo ordenadas por vistas."
        action={posts.status === "fulfilled" && posts.value.count > 0 ? (
          <span className="text-xs text-muted-foreground">{posts.value.count} en el periodo</span>
        ) : undefined}
      >
        {posts.status === "fulfilled" ? (
          posts.value.top.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {posts.value.top.map((post) => <PostCard key={post.id} post={post} />)}
            </ul>
          ) : (
            <EmptyState icon={ImageIcon} title="Sin publicaciones en este periodo" description="Publica en Instagram y sus métricas aparecerán aquí." />
          )
        ) : (
          <SectionError reason={posts.reason} />
        )}
      </Card>

      {/* Atribución a la web */}
      <Card title="De Instagram a tu web" icon={Globe} info="Según GA4: solo cuenta visitantes que aceptan cookies.">
        {traffic.status === "fulfilled" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat icon={Globe} label="Sesiones en juantapias.dev" value={n(traffic.value.instagram.sessions)} />
              <MiniStat icon={MousePointerClick} label="Leads (formulario / WhatsApp)" value={n(traffic.value.instagram.leads)} />
              {t && t.current.profile_views > 0 && (
                <MiniStat
                  icon={UserRound}
                  label="Visitas al perfil → web"
                  info="Qué parte de las visitas a tu perfil terminó en una sesión en la web."
                  value={`${((traffic.value.instagram.sessions / t.current.profile_views) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%`}
                />
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Usa el enlace <span className="font-medium text-foreground">juantapias.dev/ig</span> en tu bio para que las visitas se atribuyan bien.
            </p>
          </>
        ) : (
          <SectionError reason={traffic.reason} />
        )}
      </Card>
    </div>
  );
}

const KINDS: Record<string, { label: string; icon: typeof Film }> = {
  REELS: { label: "Reel", icon: Film },
  FEED: { label: "Post", icon: ImageIcon },
  STORY: { label: "Historia", icon: Camera },
  CAROUSEL_ALBUM: { label: "Carrusel", icon: Images },
};

function PostCard({ post }: { post: IgPost }) {
  const thumb = post.thumbnail_url ?? post.media_url;
  const kind = post.media_type === "CAROUSEL_ALBUM" ? KINDS.CAROUSEL_ALBUM : (KINDS[post.media_product_type] ?? { label: post.media_type, icon: ImageIcon });
  const KindIcon = kind.icon;
  const i = post.insights;

  return (
    <li className="flex flex-col">
      <a
        href={post.permalink}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted">
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={post.caption?.slice(0, 80) ?? ""}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
            />
          )}
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur">
            <KindIcon aria-hidden className="size-3" />
            {kind.label}
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-6 pb-2 text-sm font-medium text-white tabular-nums">
            <Eye aria-hidden className="size-4" />
            {i?.views == null ? "—" : n(i.views)}
            <span className="sr-only">vistas</span>
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground group-hover:text-foreground">{post.caption ?? "Sin texto"}</p>
        <p className="mt-1 text-[11px] text-muted-foreground/80">{formatDate(post.timestamp)}</p>
      </a>
      <dl className="mt-2.5 grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-border pt-2.5 text-xs">
        <MediaMetric icon={Radar} label="Alcance" value={i?.reach} />
        <MediaMetric icon={Heart} label="Me gusta" value={post.like_count} />
        <MediaMetric icon={MessageCircle} label="Comentarios" value={post.comments_count} />
        <MediaMetric icon={Sparkles} label="Interacciones" value={i?.total_interactions} />
        <MediaMetric icon={Bookmark} label="Guardados" value={i?.saved} />
        <MediaMetric icon={Share2} label="Compartidos" value={i?.shares} />
      </dl>
    </li>
  );
}
