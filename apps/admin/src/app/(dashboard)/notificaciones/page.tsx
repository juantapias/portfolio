import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/form";
import { NOTIFICATION_TYPES, type NotificationType } from "@/lib/notifications";
import { formatDate } from "@/lib/format";
import { markAllRead, openNotification } from "./actions";

export const metadata: Metadata = { title: "Notificaciones" };

interface Notification {
  id: string;
  created_at: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  telegram: string | null;
}

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });
const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

export default async function NotificationsPage({ searchParams }: PageProps<"/notificaciones">) {
  const { tipo } = await searchParams;
  const filter = typeof tipo === "string" && tipo in NOTIFICATION_TYPES ? (tipo as NotificationType) : null;

  const supabase = await createClient();
  let query = supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter) query = query.eq("type", filter);
  const { data } = await query;
  const items = (data ?? []) as Notification[];
  const unread = items.filter((i) => !i.read_at).length;

  // Agrupar por día (hora de Colombia)
  const groups = new Map<string, Notification[]>();
  for (const item of items) {
    const k = dayKey(item.created_at);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }

  return (
    <>
      <PageHeader
        title="Notificaciones"
        description={unread ? `${unread} sin leer` : "Todo al día"}
        actions={
          unread > 0 && (
            <form action={markAllRead}>
              <Button variant="secondary">Marcar todo como leído</Button>
            </form>
          )
        }
      />

      <nav className="mb-6 flex flex-wrap gap-1 text-sm" aria-label="Filtrar por tipo">
        <Chip href="/notificaciones" active={!filter} label="Todas" />
        {(Object.keys(NOTIFICATION_TYPES) as NotificationType[]).map((t) => (
          <Chip key={t} href={`/notificaciones?tipo=${t}`} active={filter === t} label={`${NOTIFICATION_TYPES[t].icon} ${NOTIFICATION_TYPES[t].label}`} />
        ))}
      </nav>

      {items.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="Aquí verás los leads nuevos, cuándo un cliente abre su presupuesto, tus seguimientos del día y cualquier problema con las conexiones."
        />
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([day, list]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{formatDate(day)}</h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {list.map((n) => (
                  <li key={n.id}>
                    <form action={openNotification}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="link" value={n.link ?? ""} />
                      <button
                        className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-background ${n.read_at ? "" : "bg-accent/5"}`}
                      >
                        <span aria-hidden className="text-lg leading-6">{NOTIFICATION_TYPES[n.type]?.icon ?? "🔔"}</span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className={`text-sm ${n.read_at ? "" : "font-semibold"}`}>{n.title}</span>
                            <span className="shrink-0 text-xs text-muted tabular-nums">{time(n.created_at)}</span>
                          </span>
                          {n.body && <span className="mt-0.5 block whitespace-pre-line text-sm text-muted">{n.body}</span>}
                          <span className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                            {!n.read_at && <span className="size-1.5 rounded-full bg-accent" aria-label="Sin leer" />}
                            {n.telegram === "enviado" && <span>Enviado a Telegram</span>}
                            {n.telegram?.startsWith("error") && <span className="text-red-600 dark:text-red-400">Telegram: {n.telegram.slice(7)}</span>}
                          </span>
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 ${active ? "bg-foreground text-background" : "text-muted hover:bg-surface hover:text-foreground"}`}
    >
      {label}
    </Link>
  );
}
