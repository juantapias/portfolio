import type { MetadataRoute } from "next";

/** Permite instalar el admin como app (pantalla de inicio en iOS / Android, ventana propia en escritorio). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Tapias · Admin",
    short_name: "Admin",
    description: "Leads, presupuestos y métricas de marketing.",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Accesos directos al mantener pulsado el icono (Android / escritorio)
    shortcuts: [
      { name: "Nuevo lead", url: "/crm/nuevo", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Nuevo presupuesto", url: "/presupuestos/nuevo", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Notificaciones", url: "/notificaciones", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
