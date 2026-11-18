import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedNav } from "@/components/ui/segmented-nav";
import { NOTIFICATION_ICONS, NotificationIcon } from "@/components/notification-icon";
import { BellOff, Inbox } from "lucide-react";
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

      <SegmentedNav
        label="Filtrar por tipo"
        active={filter ?? "todas"}
        className="mb-6"
        items={[
          { key: "todas", href: "/notificaciones", label: "Todas", icon: <Inbox /> },
          ...(Object.keys(NOTIFICATION_TYPES) as NotificationType[]).map((t) => {
            const Icon = NOTIFICATION_ICONS[t].icon;
            return { key: t, href: `/notificaciones?tipo=${t}`, label: NOTIFICATION_TYPES[t].label, icon: <Icon /> };
          }),
        ]}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="Sin notificaciones"
          description="Aquí verás los leads nuevos, cuándo un cliente abre su presupuesto, tus seguimientos del día y cualquier problema con las conexiones."
        />
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([day, list]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{formatDate(day)}</h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {list.map((n) => (
                  <li key={n.id}>
                    <form action={openNotification}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="link" value={n.link ?? ""} />
                      <button
                        className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${n.read_at ? "" : "bg-primary/5"}`}
                      >
                        <NotificationIcon type={n.type} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className={`text-sm ${n.read_at ? "" : "font-semibold"}`}>{n.title}</span>
                            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{time(n.created_at)}</span>
                          </span>
                          {n.body && <span className="mt-0.5 block whitespace-pre-line text-sm text-muted-foreground">{n.body}</span>}
                          <span className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                            {!n.read_at && <span className="size-1.5 rounded-full bg-primary" aria-label="Sin leer" />}
                            {n.telegram === "enviado" && <span>Enviado a Telegram</span>}
                            {n.telegram?.startsWith("error") && <span className="text-destructive">Telegram: {n.telegram.slice(7)}</span>}
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

