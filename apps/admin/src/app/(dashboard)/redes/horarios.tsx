import { CalendarClock, Camera, Clock, Music2, Sparkles, Users } from "lucide-react";
import { Card, surfaceClass } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heatmap } from "@/components/charts/heatmap";
import { getOnlineFollowers, getPostTimings, isInstagramConfigured } from "@/lib/social/instagram";
import { getConnection, getVideos, isTikTokConfigured } from "@/lib/social/tiktok";
import { DAYS, bestSlots, hourLabel, hoursRange, onlineHeatmap, postsBySlot } from "@/lib/social/schedule";
import { cn } from "@/lib/utils";
import { Callout, SectionError, n } from "./shared";

const pct = (v: number) => `${v.toLocaleString("es-CO", { maximumFractionDigits: 1 })} % de la actividad del día`;

export async function ScheduleTab() {
  if (!isInstagramConfigured()) {
    return <EmptyState icon={Camera} title="Instagram no está conectado" description="Faltan INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID." />;
  }

  const tiktokOn = isTikTokConfigured() && (await getConnection().catch(() => null));
  const [online, igPosts, ttVideos] = await Promise.allSettled([
    getOnlineFollowers(),
    getPostTimings(50),
    tiktokOn ? getVideos(40) : Promise.reject(new Error("TikTok sin conectar")),
  ]);

  const heat = online.status === "fulfilled" && online.value.length > 0 ? onlineHeatmap(online.value) : null;
  const slots = heat ? bestSlots(heat.grid) : null;
  const igSlots = igPosts.status === "fulfilled" ? postsBySlot(igPosts.value) : null;
  const ttSlots =
    ttVideos.status === "fulfilled"
      ? postsBySlot(
          ttVideos.value.map((v) => ({
            timestamp: v.create_time * 1000,
            reach: v.view_count ?? 0,
            interactions: (v.like_count ?? 0) + (v.comment_count ?? 0) + (v.share_count ?? 0),
          })),
        )
      : null;
  // Franja con mejor alcance mediano entre las que tienen al menos 3 publicaciones
  const bestPostSlot = igSlots?.filter((s) => s.posts >= 3).sort((a, b) => b.reach - a.reach)[0];

  return (
    <div className="space-y-4">
      {slots && (
        <section aria-labelledby="mejores-franjas" className={cn(surfaceClass, "p-4 md:p-5")}>
          <h2 id="mejores-franjas" className="flex items-center gap-2 font-medium">
            <Sparkles aria-hidden className="size-4 text-brand" />
            Mejores momentos para publicar
          </h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-3">
            {slots.best.map((s, i) => (
              <li key={`${s.day}-${s.hour}`} className="rounded-xl bg-muted px-3.5 py-3">
                <p className="text-xs text-muted-foreground">{i + 1}.ª opción</p>
                <p className="mt-0.5 font-medium">
                  {DAYS[s.day]} · {hourLabel(s.hour)}
                </p>
                <p className="text-xs text-muted-foreground">{pct(s.value)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-3 space-y-2">
            {slots.avoid.length > 0 && (
              <Callout icon={Clock} tone="info">
                Evita publicar entre las <strong>{hoursRange(slots.avoid)}</strong>: menos de la mitad de tus seguidores están conectados.
              </Callout>
            )}
            {bestPostSlot && (
              <Callout icon={CalendarClock} tone="info">
                Tus publicaciones de <strong>{bestPostSlot.label.toLowerCase()}</strong> ({bestPostSlot.hint}) son las que más alcance logran:{" "}
                {n(Math.round(bestPostSlot.reach))} cuentas en una publicación típica.
              </Callout>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Hora de Colombia. Con una curva pareja, el gancho del primer segundo pesa más que la hora exacta.
          </p>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Card
          title="Cuándo están conectados tus seguidores"
          icon={Users}
          info="Instagram: seguidores en línea por hora, últimos 30 días. Cada día se reparte en 100 %, para que el crecimiento de la cuenta no distorsione la comparación."
        >
          {online.status === "rejected" ? (
            <SectionError reason={online.reason} />
          ) : heat ? (
            <>
              <Heatmap
                columns={DAYS.map((d) => ({ label: d, short: d.slice(0, 3) }))}
                rows={Array.from({ length: 24 }, (_, h) => hourLabel(h))}
                values={heat.grid}
                texts={heat.grid.map((row) => row.map(pct))}
              />
              <p className="mt-2 text-xs text-muted-foreground">Promedio de {heat.days} días medidos.</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Instagram aún no tiene datos de seguidores en línea.</p>
          )}
        </Card>

        <Card
          title="Cómo te fue según la hora de publicación"
          icon={CalendarClock}
          info="Agrupa tus publicaciones por la hora en que salieron. Se usa la mediana del alcance para que un solo viral no infle una franja."
        >
          <div className="space-y-6">
            <SlotTable
              network="Instagram"
              icon={Camera}
              reachLabel="Alcance típico"
              slots={igSlots}
              error={igPosts.status === "rejected" ? igPosts.reason : null}
            />
            <SlotTable
              network="TikTok"
              icon={Music2}
              reachLabel="Vistas típicas"
              slots={ttSlots}
              error={ttVideos.status === "rejected" && tiktokOn ? ttVideos.reason : null}
              emptyText={tiktokOn ? undefined : "Conecta TikTok en la pestaña TikTok para ver sus videos aquí."}
            />
            <p className="text-xs text-muted-foreground">
              Franjas con menos de 3 publicaciones se marcan como «pocos datos». Si casi todo lo publicas a la misma hora, prueba otras
              franjas unas semanas para poder comparar.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SlotTable({
  network,
  icon: Icon,
  reachLabel,
  slots,
  error,
  emptyText,
}: {
  network: string;
  icon: typeof Camera;
  reachLabel: string;
  slots: ReturnType<typeof postsBySlot> | null;
  error?: unknown;
  emptyText?: string;
}) {
  const total = slots?.reduce((s, x) => s + x.posts, 0) ?? 0;
  const maxReach = Math.max(...(slots ?? []).filter((s) => s.posts >= 3).map((s) => s.reach), 0);

  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
        {network}
        {total > 0 && <span className="font-normal text-muted-foreground">· {total} publicaciones</span>}
      </h3>
      {error ? (
        <SectionError reason={error} />
      ) : !slots || total === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText ?? "Sin publicaciones todavía."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-3 font-medium">Franja</th>
                <th className="px-3 py-2 text-right font-medium">Publicaciones</th>
                <th className="px-3 py-2 text-right font-medium">{reachLabel}</th>
                <th className="py-2 pl-3 text-right font-medium">Interacciones prom.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slots.map((s) => {
                const few = s.posts > 0 && s.posts < 3;
                const top = s.posts >= 3 && s.reach === maxReach && maxReach > 0;
                return (
                  <tr key={s.key}>
                    <td className="py-2.5 pr-3">
                      <span className={cn(top && "font-medium")}>{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.hint}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{s.posts || "—"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {s.posts ? n(Math.round(s.reach)) : "—"}
                      {few && <span className="block text-xs text-muted-foreground">pocos datos</span>}
                      {top && <span className="block text-xs text-success">la mejor</span>}
                    </td>
                    <td className="py-2.5 pl-3 text-right tabular-nums">{s.posts ? n(Math.round(s.interactions)) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
