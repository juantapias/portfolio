/**
 * Tema claro / oscuro. La preferencia se guarda en localStorage ("light" | "dark" | "system")
 * y se aplica como clase .dark en <html>. Sin preferencia, sigue al sistema operativo.
 */
export type ThemePreference = "light" | "dark" | "system";

export const THEME_KEY = "admin-theme";

/** Se ejecuta en <head> antes de pintar para evitar el destello del tema equivocado. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export function readPreference(): ThemePreference {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

const CHANGE_EVENT = "admin-theme-change";

export function applyPreference(pref: ThemePreference) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* almacenamiento bloqueado: se aplica solo en esta visita */
  }
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Suscripción para useSyncExternalStore: cambios en esta pestaña, en otras pestañas y del sistema. */
export function subscribePreference(onChange: () => void) {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (readPreference() === "system") applyPreference("system");
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_KEY) applyPreference(readPreference());
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  mq.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    mq.removeEventListener("change", onSystem);
  };
}
