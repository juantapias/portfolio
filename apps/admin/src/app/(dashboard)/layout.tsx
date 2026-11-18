import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/shell/header";
import { Sidebar } from "@/components/shell/sidebar";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import type { NotificationPreview } from "@/components/shell/notifications-menu";
import { createClient } from "@/lib/supabase/server";

const rtf = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });

/** "hace 5 min", "ayer"… calculado en el servidor (evita desajustes de hidratación) */
function timeAgo(iso: string) {
  const s = (Date.parse(iso) - Date.now()) / 1000;
  const abs = Math.abs(s);
  if (abs < 60) return "ahora";
  if (abs < 3600) return rtf.format(Math.round(s / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(s / 3600), "hour");
  if (abs < 7 * 86400) return rtf.format(Math.round(s / 86400), "day");
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: "America/Bogota" });
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // El proxy ya redirige, pero verificamos también aquí (defensa en profundidad).
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const email = data.claims.email as string | undefined;
  const [{ count: unread }, { data: profile }, { data: recent }] = await Promise.all([
    supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null),
    supabase.from("business_profile").select("legal_name").limit(1).maybeSingle(),
    supabase
      .from("notifications")
      .select("id, created_at, type, title, body, link, read_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  const sidebarCollapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";
  const badges = { notificaciones: unread ?? 0 };
  const name = (profile?.legal_name as string | undefined) ?? null;
  const notifications: NotificationPreview[] = (recent ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    read: !!n.read_at,
    ago: timeAgo(n.created_at),
  }));

  return (
    <div className="min-h-screen md:flex md:gap-4 md:p-4 print:block print:p-0">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Saltar al contenido
      </a>

      {/* Escritorio: barra lateral flotante, fija y contraíble */}
      <Sidebar badges={badges} defaultCollapsed={sidebarCollapsed} />

      <div className="mx-auto w-full max-w-[1400px] min-w-0 flex-1">
        <Header badges={badges} name={name} email={email} notifications={notifications} />
        <main id="contenido" className="px-4 py-6 md:px-2 md:py-8 lg:px-6 print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
