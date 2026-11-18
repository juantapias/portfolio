/** Formato de montos y fechas para Colombia. */

const ZERO_DECIMALS = new Set(["COP", "CLP", "JPY", "PYG"]);

export function formatMoney(amount: number | string | null | undefined, currency = "COP") {
  const value = Number(amount ?? 0);
  const digits = ZERO_DECIMALS.has(currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("es-CO")}`;
  }
}

/** Fecha `YYYY-MM-DD` o ISO → "18 nov 2026" */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Hoy en Colombia como `YYYY-MM-DD` */
export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** Instante de hace `days` días, en ISO (para filtrar por created_at). */
export function daysAgoISO(days: number) {
  return new Date(Date.now() - days * 864e5).toISOString();
}
