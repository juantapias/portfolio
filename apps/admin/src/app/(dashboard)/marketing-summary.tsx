import { Camera, Globe, MousePointerClick, Music2 } from "lucide-react";
import { CardLink, Stat } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { StatGridSkeleton } from "@/components/skeletons";
import { getSessionBreakdown } from "@/lib/analytics";
import { isGoogleConfigured } from "@/lib/google/client";
import { getDaily, getProfile, getTotals, isInstagramConfigured } from "@/lib/social/instagram";
import { getConnection, getUser, isTikTokConfigured } from "@/lib/social/tiktok";
import { createClient } from "@/lib/supabase/server";
import { daysAgoISO } from "@/lib/format";

const DAYS = 28;
const n = (v: number) => v.toLocaleString("es-CO");

/** Fila de marketing del Resumen (GA4 + Instagram + TikTok + CRM). Se carga aparte con Suspense. */
export async function MarketingSummary() {
  const supabase = await createClient();
  const since = daysAgoISO(DAYS);
  const prevSince = daysAgoISO(DAYS * 2);

  const [web, igProfile, igTotals, igFollows, tiktok, leads] = await Promise.allSettled([
    isGoogleConfigured() ? getSessionBreakdown(DAYS) : Promise.reject(new Error("GA4 sin conectar")),
    isInstagramConfigured() ? getProfile() : Promise.reject(new Error("sin conectar")),
    isInstagramConfigured() ? getTotals(DAYS) : Promise.reject(new Error("sin conectar")),
    isInstagramConfigured() ? getDaily("follower_count", DAYS) : Promise.reject(new Error("sin conectar")),
    isTikTokConfigured()
      ? getConnection().then((c) => (c ? getUser() : Promise.reject(new Error("sin conectar"))))
      : Promise.reject(new Error("sin conectar")),
    supabase.from("leads").select("created_at").gte("created_at", prevSince),
  ]);

  const leadRows = leads.status === "fulfilled" ? (leads.value.data ?? []) : [];
  const leadsNow = leadRows.filter((l) => l.created_at >= since).length;
  const leadsPrev = leadRows.length - leadsNow;
  const sessions = web.status === "fulfilled" ? web.value : null;
  const newFollowers = igFollows.status === "fulfilled" ? igFollows.value.reduce((s, d) => s + d.value, 0) : null;

  return (
    <section className="mt-8" aria-labelledby="marketing-title">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Últimos {DAYS} días</p>
          <h2 id="marketing-title" className="font-heading text-2xl">Marketing</h2>
        </div>
        <CardLink href="/conversion">Ver embudo</CardLink>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat href="/analitica" icon={Globe} label="Visitas a la web" value={sessions ? n(sessions.current) : "—"} info="Sesiones en Google Analytics 4, comparadas con los 28 días anteriores.">
          {sessions ? <Delta current={sessions.current} previous={sessions.previous} /> : <Muted>GA4 sin datos</Muted>}
        </Stat>
        <Stat
          href="/conversion"
          icon={MousePointerClick}
          label="Visitas → lead"
          value={sessions?.current ? `${((leadsNow / sessions.current) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%` : "—"}
          info="Porcentaje de visitas que terminaron en un lead nuevo en el CRM."
        >
          <Muted>
            {n(leadsNow)} lead{leadsNow === 1 ? "" : "s"} · antes {n(leadsPrev)}
          </Muted>
        </Stat>
        <Stat
          href="/redes?red=instagram"
          icon={Camera}
          label="Instagram"
          value={igProfile.status === "fulfilled" ? `${n(igProfile.value.followers_count)} seg.` : "—"}
        >
          {igTotals.status === "fulfilled" ? (
            <Muted>
              {newFollowers != null && `+${n(newFollowers)} nuevos · `}
              {n(igTotals.value.current.reach)} de alcance
            </Muted>
          ) : (
            <Muted>Sin conectar</Muted>
          )}
        </Stat>
        <Stat href="/redes?red=tiktok" icon={Music2} label="TikTok" value={tiktok.status === "fulfilled" ? `${n(tiktok.value.follower_count)} seg.` : "—"}>
          <Muted>
            {tiktok.status === "fulfilled" ? `${n(tiktok.value.likes_count)} me gusta · ${n(tiktok.value.video_count)} videos` : "Sin conectar"}
          </Muted>
        </Stat>
      </div>
    </section>
  );
}

export function MarketingSummarySkeleton() {
  return (
    <section className="mt-8" aria-busy="true" aria-label="Cargando marketing">
      <div className="mb-4">
        <p className="eyebrow mb-2">Últimos {DAYS} días</p>
        <h2 className="font-heading text-2xl">Marketing</h2>
      </div>
      <StatGridSkeleton />
    </section>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}
