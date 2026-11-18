"use client";

import { useEffect, useRef, useState } from "react";
import { es } from "react-day-picker/locale";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { controlClass } from "./form";

/** "YYYY-MM-DD" → Date local (sin desfase de zona horaria) */
function parseISO(value?: string | null) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : undefined;
}

/** Date → "YYYY-MM-DD" local, el mismo formato que enviaba <input type="date"> */
function toISO(date?: Date) {
  if (!date) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function addDays(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

const PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "Mañana", days: 1 },
  { label: "En 3 días", days: 3 },
  { label: "En 1 semana", days: 7 },
  { label: "En 15 días", days: 15 },
];

/**
 * Selector de fecha (Popover + Calendar de shadcn) que se integra con formularios
 * de server actions: envía el valor en un <input hidden name={name}> con formato
 * YYYY-MM-DD, igual que el <input type="date"> nativo al que reemplaza.
 * Vuelve a su valor inicial cuando el formulario se resetea.
 */
export function DatePicker({
  name,
  defaultValue,
  placeholder = "Elegir fecha",
  required = false,
  presets = false,
  className,
  "aria-label": ariaLabel,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  /** Atajos (Hoy, Mañana, En 1 semana…): útiles para seguimientos */
  presets?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [date, setDate] = useState(() => parseISO(defaultValue));
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => setDate(parseISO(defaultValue));
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue]);

  function pick(d?: Date) {
    setDate(d);
    setOpen(false);
  }

  const label = date
    ? date.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : placeholder;

  return (
    <div className={cn("relative", className)}>
      <input ref={inputRef} type="hidden" name={name} value={toISO(date)} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel ? `${ariaLabel}: ${date ? label : "sin fecha"}` : undefined}
            className={cn(
              controlClass,
              "flex h-11 items-center gap-2 text-left md:h-9",
              !date && "text-muted-foreground",
              date && !required && "pr-9",
            )}
          >
            <CalendarDays aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate first-letter:uppercase">{label}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex flex-col sm:flex-row">
            {presets && (
              <ul className="flex flex-wrap gap-1 border-b border-border p-2 sm:w-32 sm:flex-col sm:border-r sm:border-b-0">
                {PRESETS.map((p) => (
                  <li key={p.label}>
                    <button
                      type="button"
                      onClick={() => pick(addDays(p.days))}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Calendar
              mode="single"
              locale={es}
              selected={date}
              defaultMonth={date}
              onSelect={(d: Date | undefined) => pick(d)}
              required={required}
              autoFocus
            />
          </div>
        </PopoverContent>
      </Popover>
      {date && !required && (
        <button
          type="button"
          onClick={() => setDate(undefined)}
          aria-label="Quitar fecha"
          className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
