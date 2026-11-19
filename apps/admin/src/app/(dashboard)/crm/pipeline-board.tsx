"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUSES, leadStatus, sourceLabel } from "@/lib/crm";
import { formatDate, formatMoney } from "@/lib/format";
import type { Lead, LeadStatus } from "@/lib/types";
import { moveLead } from "./actions";

type Move = { id: string; status: LeadStatus };

export function PipelineBoard({ leads, today }: { leads: Lead[]; today: string }) {
  const [optimistic, applyMove] = useOptimistic(leads, (state, { id, status }: Move) =>
    state.map((l) => (l.id === id ? { ...l, status } : l)),
  );
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Evita que soltar una tarjeta dispare la navegación del enlace
  const justDragged = useRef(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // En táctil, mantener pulsado para arrastrar; un deslizamiento rápido sigue haciendo scroll
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const active = activeId ? optimistic.find((l) => l.id === activeId) : undefined;
  const nameOf = (id: string | number) => optimistic.find((l) => l.id === id)?.name ?? "Lead";
  const labelOf = (id: string | number) => leadStatus(id as LeadStatus)?.label ?? String(id);

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Moviendo a ${nameOf(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${nameOf(active.id)} sobre ${labelOf(over.id)}.` : `${nameOf(active.id)} fuera de las columnas.`),
    onDragEnd: ({ active, over }) => (over ? `${nameOf(active.id)} movido a ${labelOf(over.id)}.` : `Movimiento cancelado.`),
    onDragCancel: ({ active }) => `Movimiento de ${nameOf(active.id)} cancelado.`,
  };

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
    setError(null);
    justDragged.current = true;
    navigator.vibrate?.(10);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setTimeout(() => (justDragged.current = false), 0);
    if (!over) return;
    const id = String(active.id);
    const status = over.id as LeadStatus;
    if (optimistic.find((l) => l.id === id)?.status === status) return;

    startTransition(async () => {
      applyMove({ id, status });
      const res = await moveLead(id, status);
      if (res.error) setError(`No se pudo mover a ${nameOf(id)}: ${res.error}`);
    });
  }

  return (
    <DndContext
      id="crm-pipeline"
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: "Pulsa espacio o enter para tomar el lead, usa las flechas para cambiar de columna y espacio o enter para soltarlo. Escape cancela.",
        },
      }}
    >
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <div
        className={`scrollbar-none -mx-4 flex scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:gap-4 md:px-0 ${
          activeId ? "" : "snap-x snap-mandatory md:snap-none"
        }`}
      >
        {LEAD_STATUSES.map((status) => (
          <Column
            key={status.value}
            status={status}
            leads={optimistic.filter((l) => l.status === status.value)}
            today={today}
            activeId={activeId}
            justDragged={justDragged}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {active && (
          <div className="rotate-2 scale-[1.03] cursor-grabbing rounded-xl shadow-xl shadow-black/15 ring-1 ring-ring/40">
            <CardBody lead={active} today={today} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  status,
  leads,
  today,
  activeId,
  justDragged,
}: {
  status: (typeof LEAD_STATUSES)[number];
  leads: Lead[];
  today: string;
  activeId: string | null;
  justDragged: React.RefObject<boolean>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status.value });
  const fromHere = leads.some((l) => l.id === activeId);

  return (
    <section aria-label={`${status.label}: ${leads.length}`} className="flex w-[82vw] max-w-sm shrink-0 snap-start flex-col md:w-72">
      <header className="mb-3 flex items-center justify-between px-1">
        <Badge tone={status.tone}>{status.label}</Badge>
        <span className="text-xs tabular-nums text-muted-foreground">{leads.length}</span>
      </header>
      <ul
        ref={setNodeRef}
        className={`-m-1.5 min-h-24 flex-1 space-y-2 rounded-2xl p-1.5 transition-colors duration-150 ${
          isOver && !fromHere ? "bg-brand/8 ring-2 ring-inset ring-ring/50" : activeId ? "bg-muted/40" : ""
        }`}
      >
        {leads.map((lead) => (
          <li key={lead.id}>
            <DraggableCard lead={lead} today={today} justDragged={justDragged} />
          </li>
        ))}
        {leads.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            {activeId ? "Suelta aquí" : "Vacío"}
          </li>
        )}
      </ul>
    </section>
  );
}

function DraggableCard({ lead, today, justDragged }: { lead: Lead; today: string; justDragged: React.RefObject<boolean> }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: lead.id });

  return (
    <Link
      ref={setNodeRef}
      href={`/crm/${lead.id}`}
      {...attributes}
      {...listeners}
      aria-roledescription="lead arrastrable"
      onClick={(e) => justDragged.current && e.preventDefault()}
      onContextMenu={(e) => (e.nativeEvent as PointerEvent).pointerType === "touch" && e.preventDefault()}
      className={`pressable block cursor-grab touch-manipulation select-none rounded-xl outline-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-ring ${
        isDragging ? "opacity-35" : ""
      }`}
    >
      <CardBody lead={lead} today={today} interactive />
    </Link>
  );
}

function CardBody({ lead, today, interactive }: { lead: Lead; today: string; interactive?: boolean }) {
  const overdue =
    lead.next_follow_up && lead.next_follow_up <= today && !["ganado", "perdido"].includes(lead.status);

  return (
    <div
      className={`rounded-xl border border-border bg-card p-3.5 ${
        interactive ? "transition-colors hover:border-foreground/30 active:bg-accent" : ""
      }`}
    >
      <p className="font-medium leading-tight">{lead.name}</p>
      {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {lead.estimated_value != null ? (
          <span className="font-medium text-foreground tabular-nums">{formatMoney(lead.estimated_value, lead.currency)}</span>
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
    </div>
  );
}
