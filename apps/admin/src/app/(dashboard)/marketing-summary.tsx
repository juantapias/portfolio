import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
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
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-muted">Marketing · últimos {DAYS} días</h2>
        <Link href="/conversion" className="text-xs text-muted hover:text-accent">Ver embudo →</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile href="/analitica" label="Visitas a la web" value={sessions ? n(sessions.current) : "—"}>
          {sessions ? <Delta current={sessions.current} previous={sessions.previous} /> : <Muted>GA4 sin datos</Muted>}
        </Tile>
        <Tile
          href="/conversion"
          label="Visitas → lead"
          value={sessions?.current ? `${((leadsNow / sessions.current) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })}%` : "—"}
        >
          <Muted>
            {n(leadsNow)} lead{leadsNow === 1 ? "" : "s"} · antes {n(leadsPrev)}
          </Muted>
        </Tile>
        <Tile
          href="/redes"
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
        </Tile>
        <Tile href="/redes" label="TikTok" value={tiktok.status === "fulfilled" ? `${n(tiktok.value.follower_count)} seg.` : "—"}>
          <Muted>
            {tiktok.status === "fulfilled" ? `${n(tiktok.value.likes_count)} me gusta · ${n(tiktok.value.video_count)} videos` : "Sin conectar"}
          </Muted>
        </Tile>
      </div>
    </section>
  );
}

export function MarketingSummarySkeleton() {
  return (
    <section className="mt-8" aria-busy="true" aria-label="Cargando marketing">
      <h2 className="mb-3 text-sm font-medium text-muted">Marketing · últimos {DAYS} días</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[118px] animate-pulse rounded-lg border border-border bg-surface" />
        ))}
      </div>
    </section>
  );
}

function Tile({ href, label, value, children }: { href: string; label: string; value: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block transition-opacity hover:opacity-80">
      <Card>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
        <p className="mt-1">{children}</p>
      </Card>
    </Link>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}
