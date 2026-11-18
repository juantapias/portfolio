import type { LeadStatus } from "./types";

export const LEAD_STATUSES: { value: LeadStatus; label: string; tone: Tone }[] = [
  { value: "nuevo", label: "Nuevo", tone: "blue" },
  { value: "contactado", label: "Contactado", tone: "amber" },
  { value: "propuesta", label: "Propuesta", tone: "violet" },
  { value: "ganado", label: "Ganado", tone: "green" },
  { value: "perdido", label: "Perdido", tone: "neutral" },
];

export const LEAD_SOURCES = [
  { value: "web", label: "Web" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referido", label: "Referido" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "manual", label: "Otro" },
];

export const ACTIVITY_TYPES = [
  { value: "nota", label: "Nota" },
  { value: "llamada", label: "Llamada" },
  { value: "email", label: "Email" },
  { value: "reunion", label: "Reunión" },
  { value: "whatsapp", label: "WhatsApp" },
];

/** Etiquetas de las respuestas del formulario de la landing */
export const FORM_FIELDS: { key: string; label: string }[] = [
  { key: "service", label: "Necesita" },
  { key: "stage", label: "Etapa del negocio" },
  { key: "budget", label: "Presupuesto" },
  { key: "timeline", label: "Para cuándo" },
];

export type Tone = "blue" | "amber" | "violet" | "green" | "red" | "neutral";

export function leadStatus(value: LeadStatus) {
  return LEAD_STATUSES.find((s) => s.value === value)!;
}

export function sourceLabel(value: string | null) {
  if (!value) return null;
  return LEAD_SOURCES.find((s) => s.value === value)?.label ?? value;
}

export function activityLabel(value: string) {
  if (value === "cambio_estado") return "Cambio de estado";
  return ACTIVITY_TYPES.find((a) => a.value === value)?.label ?? value;
}
