import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // El proxy ya redirige, pero verificamos también aquí (defensa en profundidad).
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const email = data.claims.email as string | undefined;
  const { count: unread } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="flex flex-col gap-6 print:hidden border-b border-border p-4 md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <p className="px-3 text-sm font-semibold tracking-tight">Tapias · Admin</p>
        <Sidebar badges={{ notificaciones: unread ?? 0 }} />
        <div className="mt-auto hidden px-3 text-xs text-muted md:block">
          <p className="truncate">{email}</p>
          <form action="/auth/signout" method="post">
            <button className="mt-2 underline-offset-2 hover:text-foreground hover:underline">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-10 print:p-0">{children}</main>
    </div>
  );
}
