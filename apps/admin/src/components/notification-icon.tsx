import { Bell, CalendarClock, Eye, Hourglass, TriangleAlert, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icono y color por tipo de notificación (los emojis quedan solo para Telegram). */
export const NOTIFICATION_ICONS: Record<string, { icon: LucideIcon; tone: string }> = {
  "lead.nuevo": { icon: UserPlus, tone: "bg-primary/12 text-brand" },
  "presupuesto.visto": { icon: Eye, tone: "bg-info/12 text-info" },
  "seguimiento.hoy": { icon: CalendarClock, tone: "bg-violet/12 text-violet" },
  "presupuesto.vence": { icon: Hourglass, tone: "bg-warning/12 text-warning" },
  "sistema.error": { icon: TriangleAlert, tone: "bg-destructive/12 text-destructive" },
};

const FALLBACK = { icon: Bell, tone: "bg-muted text-muted-foreground" };

export function NotificationIcon({ type, className }: { type: string; className?: string }) {
  const { icon: Icon, tone } = NOTIFICATION_ICONS[type] ?? FALLBACK;
  return (
    <span aria-hidden className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full", tone, className)}>
      <Icon className="size-4" />
    </span>
  );
}
