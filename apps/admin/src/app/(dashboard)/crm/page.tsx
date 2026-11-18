import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/form";
import { LEAD_STATUSES, sourceLabel } from "@/lib/crm";
import { formatDate, formatMoney, todayISO } from "@/lib/format";
import type { Lead } from "@/lib/types";
import { CalendarClock } from "lucide-react";

export const metadata: Metadata = { title: "CRM" };

export default async function CrmPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];
  const today = todayISO();
  const pendingFollowUps = leads.filter(
    (l) => l.next_follow_up && l.next_follow_up <= today && !["ganado", "perdido"].includes(l.status),
  ).length;

  return (
    <>
      <PageHeader
        title="CRM"
        description={
          leads.length
            ? `${leads.length} leads · ${pendingFollowUps} seguimiento${pendingFollowUps === 1 ? "" : "s"} para hoy o atrasado${pendingFollowUps === 1 ? "" : "s"}`
            : "Leads y clientes, desde el primer contacto hasta el cierre."
        }
        actions={<Link href="/crm/nuevo" className={buttonClass()}>Nuevo lead</Link>}
      />

      {error && <p className="mb-4 text-sm text-destructive">{error.message}</p>}

      {leads.length === 0 ? (
        <EmptyState
          title="Todavía no hay leads"
          description="Crea el primero a mano. Más adelante llegarán solos desde el formulario de la web."
          action={<Link href="/crm/nuevo" className={buttonClass()}>Crear lead</Link>}
        />
      ) : (
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {LEAD_STATUSES.map((status) => {
            const column = leads.filter((l) => l.status === status.value);
            return (
              <section key={status.value} className="w-72 shrink-0 snap-start">
                <header className="mb-3 flex items-center justify-between px-1">
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">{column.length}</span>
                </header>
                <ul className="space-y-2">
                  {column.map((lead) => (
                    <li key={lead.id}>
                      <LeadCard lead={lead} today={today} />
                    </li>
                  ))}
                  {column.length === 0 && (
                    <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Vacío
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function LeadCard({ lead, today }: { lead: Lead; today: string }) {
  const overdue =
    lead.next_follow_up && lead.next_follow_up <= today && !["ganado", "perdido"].includes(lead.status);

  return (
    <Link
      href={`/crm/${lead.id}`}
      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/30"
    >
      <p className="font-medium leading-tight">{lead.name}</p>
      {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {lead.estimated_value != null ? (
          <span className="font-medium text-foreground tabular-nums">
            {formatMoney(lead.estimated_value, lead.currency)}
          </span>
        ) : lead.form_data?.budget ? (
          <span className="text-foreground">{lead.form_data.budget}</span>
        ) : null}
        {lead.form_data?.service && <span>{lead.form_data.service}</span>}
        {lead.source && <span>{sourceLabel(lead.source)}</span>}
        {lead.next_follow_up && (
          <span className={`inline-flex items-center gap-1 ${overdue ? "font-medium text-destructive" : ""}`}>
            <CalendarClock aria-label="Seguimiento" className="size-3.5" />
            {formatDate(lead.next_follow_up)}
          </span>
        )}
      </div>
    </Link>
  );
}
