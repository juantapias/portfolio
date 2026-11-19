/**
 * Cálculos de la pestaña «Horarios»: cuándo están conectados los seguidores y
 * cómo rinden las publicaciones según la hora en que salieron. Todo en hora de
 * Colombia (UTC−5 fijo, sin horario de verano).
 */

const CO_OFFSET_MS = -5 * 3600_000;

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

/** Día (0 = lunes) y hora en Colombia de un instante */
export function colombiaSlot(ms: number) {
  const d = new Date(ms + CO_OFFSET_MS);
  return { day: (d.getUTCDay() + 6) % 7, hour: d.getUTCHours() };
}

export function hourLabel(h: number) {
  const suffix = h < 12 ? "a. m." : "p. m.";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return h === 12 ? "12:00 m." : `${hh}:00 ${suffix}`;
}

/**
 * Matriz [día][hora] con el % de la actividad diaria que cae en cada hora,
 * promediado entre todos los días medidos. Normalizar por día evita que los
 * días con más seguidores (la cuenta crece) pesen más que el resto.
 */
export function onlineHeatmap(days: { start: number; hours: Record<string, number> }[]) {
  const sum = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  const count = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const { start, hours } of days) {
    const total = Object.values(hours).reduce((s, v) => s + v, 0);
    if (!total) continue;
    for (const [h, v] of Object.entries(hours)) {
      const { day, hour } = colombiaSlot(start + Number(h) * 3600_000);
      sum[day][hour] += (v / total) * 100;
      count[day][hour]++;
    }
  }
  const grid = sum.map((row, d) => row.map((s, h) => (count[d][h] ? s / count[d][h] : 0)));
  return { grid, days: days.length };
}

/** Las mejores franjas (una por día, para repartir la semana) y las horas a evitar */
export function bestSlots(grid: number[][], take = 3) {
  const cells = grid.flatMap((row, day) => row.map((value, hour) => ({ day, hour, value })));
  const best: typeof cells = [];
  for (const c of [...cells].sort((a, b) => b.value - a.value)) {
    if (best.length === take) break;
    if (!best.some((b) => b.day === c.day)) best.push(c);
  }
  const byHour = Array.from({ length: 24 }, (_, h) => grid.reduce((s, row) => s + row[h], 0) / 7);
  const peak = Math.max(...byHour);
  // Horas con menos de la mitad de la actividad de la mejor hora
  const avoid = byHour.map((v, h) => ({ h, v })).filter((x) => x.v < peak / 2).map((x) => x.h);
  return { best, byHour, avoid };
}

/** Rango legible de horas consecutivas, p. ej. [23,0,1,2] → «11:00 p. m. – 3:00 a. m.» */
export function hoursRange(hours: number[]) {
  if (hours.length === 0) return null;
  const set = new Set(hours);
  // Empieza en una hora cuya anterior no esté en el conjunto (maneja el cruce de medianoche)
  const start = hours.find((h) => !set.has((h + 23) % 24)) ?? hours[0];
  let end = start;
  while (set.has((end + 1) % 24) && (end + 1) % 24 !== start) end = (end + 1) % 24;
  return `${hourLabel(start)} – ${hourLabel((end + 1) % 24)}`;
}

export const POST_SLOTS = [
  { key: "manana", label: "Mañana", hint: "6 a. m. – 12 m.", from: 6, to: 12 },
  { key: "mediodia", label: "Mediodía y tarde", hint: "12 m. – 5 p. m.", from: 12, to: 17 },
  { key: "noche", label: "Final de la tarde", hint: "5 – 9 p. m.", from: 17, to: 21 },
  { key: "madrugada", label: "Noche y madrugada", hint: "9 p. m. – 6 a. m.", from: 21, to: 30 },
] as const;

const median = (xs: number[]) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Publicaciones agrupadas por franja de publicación: cantidad, alcance mediano e interacciones promedio */
export function postsBySlot(posts: { timestamp: number; reach: number; interactions: number }[]) {
  return POST_SLOTS.map((slot) => {
    const inSlot = posts.filter((p) => {
      const { hour } = colombiaSlot(p.timestamp);
      const h = hour < 6 ? hour + 24 : hour;
      return h >= slot.from && h < slot.to;
    });
    return {
      ...slot,
      posts: inSlot.length,
      // Mediana: un solo reel viral no debe inflar toda la franja
      reach: median(inSlot.map((p) => p.reach)),
      interactions: inSlot.length ? inSlot.reduce((s, p) => s + p.interactions, 0) / inSlot.length : 0,
    };
  });
}
