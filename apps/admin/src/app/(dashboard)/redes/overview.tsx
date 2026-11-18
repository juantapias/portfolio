import type { LucideIcon } from "lucide-react";
import { Camera, Globe, MousePointerClick, Music2, Play, Plug, Radar, Users } from "lucide-react";
import { Card, CardLink } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { buttonClass } from "@/components/ui/form";
import { BarList } from "@/components/charts/bar-list";
import { createClient } from "@/lib/supabase/server";
import { getSocialTraffic } from "@/lib/analytics";
import { isGoogleConfigured } from "@/lib/google/client";
import { getDaily, getProfile, getTotals, isInstagramConfigured } from "@/lib/social/instagram";
import { getConnection, getUser, getVideos, isTikTokConfigured } from "@/lib/social/tiktok";
import { daysAgoISO, todayISO } from "@/lib/format";
import { ProfileHeader, SectionError, n, type Range } from "./shared";

const notConnected = () => Promise.reject(new Error("sin conectar"));

/** Vista general: lo esencial de cada red lado a lado, con acceso a su detalle. */
export async function OverviewTab({ range }: { range: Range }) {
  const supabase = await createClient();
  const igOn = isInstagramConfigured();
  const ttConnection = isTikTokConfigured() ? await getConnection() : null;

  const [igProfile, igTotals, igFollows, ttUser, ttVideos, ttHistory, traffic] = await Promise.allSettled([
    igOn ? getProfile() : notConnected(),
    igOn ? getTotals(range) : notConnected(),
    igOn ? getDaily("follower_count", range) : notConnected(),
    ttConnection ? getUser() : notConnected(),
    ttConnection ? getVideos(40) : notConnected(),
    supabase
      .from("social_metrics_daily")
      .select("date, followers")
      .eq("provider", "tiktok")
      .gte("date", daysAgoISO(range).slice(0, 10))
      .order("date")
      .limit(1)
      .then(({ data }) => (data ?? []) as { date: string; followers: number | null }[]),
    isGoogleConfigured() ? getSocialTraffic(range) : Promise.reject(new Error("GA4 sin conectar")),
  ]);

  const tr = traffic.status === "fulfilled" ? traffic.value : null;
  const tab = (red: string) => `/redes?red=${red}&rango=${range}`;

  // TikTok: vistas de los videos publicados en el periodo y seguidores al inicio del periodo
  const since = new Date(daysAgoISO(range)).getTime() / 1000;
  const ttRangeViews =
    ttVideos.status === "fulfilled" ? ttVideos.value.filter((v) => v.create_time >= since).reduce((s, v) => s + (v.view_count ?? 0), 0) : null;
  const ttPast = ttHistory.status === "fulfilled" ? ttHistory.value[0] : undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Instagram */}
        <Card className="flex flex-col">
          {igProfile.status === "fulfilled" ? (
            <>
              <ProfileHeader
                network="Instagram"
                icon={Camera}
                avatar={igProfile.value.profile_picture_url}
                handle={`@${igProfile.value.username}`}
                href={`https://www.instagram.com/${igProfile.value.username}/`}
                action={<CardLink href={tab("instagram")}>Ver detalle</CardLink>}
              />
              <dl className="mt-5 grid flex-1 gap-3 sm:grid-cols-3">
                <Figure icon={Users} label="Seguidores" value={n(igProfile.value.followers_count)}>
                  {igFollows.status === "fulfilled" && (
                    <span className="text-xs text-muted-foreground">
                      +{n(igFollows.value.reduce((s, d) => s + d.value, 0))} en {range} días
                    </span>
                  )}
                </Figure>
                <Figure icon={Radar} label="Alcance" value={igTotals.status === "fulfilled" ? n(igTotals.value.current.reach) : "—"}>
                  {igTotals.status === "fulfilled" && <Delta current={igTotals.value.current.reach} previous={igTotals.value.previous.reach} />}
                </Figure>
                <Figure icon={Globe} label="Sesiones web" value={tr ? n(tr.instagram.sessions) : "—"}>
                  {tr && <span className="text-xs text-muted-foreground">{n(tr.instagram.leads)} leads</span>}
                </Figure>
              </dl>
            </>
          ) : (
            <Disconnected icon={Camera} network="Instagram" reason={igOn ? igProfile.reason : "Faltan INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID."} />
          )}
        </Card>

        {/* TikTok */}
        <Card className="flex flex-col">
          {ttUser.status === "fulfilled" ? (
            <>
              <ProfileHeader
                network="TikTok"
                icon={Music2}
                avatar={ttUser.value.avatar_url}
                handle={ttUser.value.username ? `@${ttUser.value.username}` : ttUser.value.display_name}
                href={ttUser.value.profile_deep_link ?? `https://www.tiktok.com/@${ttUser.value.username}`}
                action={<CardLink href={tab("tiktok")}>Ver detalle</CardLink>}
              />
              <dl className="mt-5 grid flex-1 gap-3 sm:grid-cols-3">
                <Figure icon={Users} label="Seguidores" value={n(ttUser.value.follower_count)}>
                  {ttPast?.followers != null && ttPast.date !== todayISO() ? (
                    <Delta current={ttUser.value.follower_count} previous={ttPast.followers} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin historial aún</span>
                  )}
                </Figure>
                <Figure icon={Play} label="Vistas de videos nuevos" value={ttRangeViews == null ? "—" : n(ttRangeViews)} />
                <Figure icon={Globe} label="Sesiones web" value={tr ? n(tr.tiktok.sessions) : "—"}>
                  {tr && <span className="text-xs text-muted-foreground">{n(tr.tiktok.leads)} leads</span>}
                </Figure>
              </dl>
            </>
          ) : (
            <Disconnected
              icon={Music2}
              network="TikTok"
              reason={!isTikTokConfigured() ? "Faltan TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET y TIKTOK_REDIRECT_URI." : ttUser.reason}
              connect={isTikTokConfigured()}
            />
          )}
        </Card>
      </div>

      {/* Comparación de tráfico */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Sesiones en la web por red" icon={Globe} info="Visitas a juantapias.dev atribuidas a cada red en GA4 (solo visitantes que aceptan cookies).">
          {tr ? (
            <BarList
              items={[
                { label: "Instagram", value: tr.instagram.sessions },
                { label: "TikTok", value: tr.tiktok.sessions },
              ]}
            />
          ) : (
            <SectionError reason={traffic.status === "rejected" ? traffic.reason : "sin datos"} />
          )}
        </Card>
        <Card title="Leads por red" icon={MousePointerClick} info="Formularios enviados y clics a WhatsApp que llegaron desde cada red.">
          {tr ? (
            <BarList
              items={[
                { label: "Instagram", value: tr.instagram.leads, hint: tr.instagram.sessions ? `${rate(tr.instagram.leads, tr.instagram.sessions)} de las sesiones` : undefined },
                { label: "TikTok", value: tr.tiktok.leads, hint: tr.tiktok.sessions ? `${rate(tr.tiktok.leads, tr.tiktok.sessions)} de las sesiones` : undefined },
              ]}
            />
          ) : (
            <SectionError reason={traffic.status === "rejected" ? traffic.reason : "sin datos"} />
          )}
        </Card>
      </div>
    </div>
  );
}

const rate = (a: number, b: number) => `${((a / b) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%`;

function Figure({ icon: Icon, label, value, children }: { icon: LucideIcon; label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-medium tabular-nums">{value}</dd>
      {children && <dd className="mt-1">{children}</dd>}
    </div>
  );
}

function Disconnected({ icon: Icon, network, reason, connect = false }: { icon: LucideIcon; network: string; reason: unknown; connect?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <span aria-hidden className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-medium">{network} sin datos</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{reason instanceof Error ? reason.message : String(reason)}</p>
      {connect && (
        <a href="/api/integrations/tiktok/connect" className={buttonClass("secondary", "mt-4")}>
          <Plug aria-hidden className="size-4" />
          Conectar {network}
        </a>
      )}
    </div>
  );
}
