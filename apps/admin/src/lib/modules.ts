/**
 * Mapa de módulos del admin. Alimenta la navegación y las páginas
 * provisionales mientras se construye cada módulo.
 */
export type ModuleKey =
  | "resumen"
  | "portfolio"
  | "crm"
  | "presupuestos"
  | "analitica"
  | "conversion"
  | "redes"
  | "ajustes";

export interface AdminModule {
  key: ModuleKey;
  href: string;
  label: string;
  description: string;
  /** Fuente de los datos del módulo */
  source: string;
  /** Lo que mostrará el módulo cuando esté terminado */
  planned: string[];
}

export const modules: AdminModule[] = [
  {
    key: "resumen",
    href: "/",
    label: "Resumen",
    description: "Lo más importante de la semana en una sola vista.",
    source: "Todos los módulos",
    planned: [
      "KPIs: sesiones, leads, tasa de conversión, seguidores",
      "Comparación con el periodo anterior",
      "Leads nuevos sin atender",
      "Mejor publicación de la semana (IG / TikTok)",
    ],
  },
  {
    key: "portfolio",
    href: "/portfolio",
    label: "Portfolio",
    description: "Casos de estudio que se publican en el portfolio.",
    source: "Supabase → build del portfolio",
    planned: [
      "Listado, creación y edición (ES / EN)",
      "Validación SEO (título ≤ 52, descripción 120–160)",
      "Orden de la grilla y proyecto destacado",
      "Botón «Publicar» que regenera el portfolio (deploy hook)",
    ],
  },
  {
    key: "crm",
    href: "/crm",
    label: "CRM",
    description: "Leads y clientes, desde el primer contacto hasta el cierre.",
    source: "Supabase (formularios de la web + carga manual)",
    planned: [
      "Pipeline: nuevo → contactado → propuesta → ganado / perdido",
      "Origen de cada lead (UTM, landing, red social)",
      "Notas, actividades y próximos seguimientos",
      "Valor estimado por oportunidad",
      "Presupuestos vinculados a cada lead",
    ],
  },
  {
    key: "presupuestos",
    href: "/presupuestos",
    label: "Presupuestos",
    description: "Cotizaciones para leads y clientes, del borrador a la aceptación.",
    source: "Supabase (vinculado al CRM)",
    planned: [
      "Crear desde un lead: ítems, cantidades, precio y descuento",
      "Multimoneda (COP, USD, EUR…) con tasa de cambio a COP para reportes",
      "Datos del emisor y régimen tributario (no responsable de IVA)",
      "Numeración automática (P-2026-001) y fecha de validez",
      "Estados: borrador → enviado → aceptado / rechazado / vencido",
      "Al enviar: el lead pasa a «propuesta»; al aceptar: a «ganado»",
      "Exportar a PDF y enlace público para que el cliente lo vea y acepte",
      "Duplicar presupuestos y plantillas de servicios frecuentes",
    ],
  },
  {
    key: "analitica",
    href: "/analitica",
    label: "Analítica web",
    description: "Tráfico del portfolio y las landings.",
    source: "Google Analytics 4 · Data API",
    planned: [
      "Sesiones, usuarios y duración media",
      "Canales y campañas (utm_source / utm_campaign)",
      "Páginas más vistas y casos de estudio",
      "Eventos clave (clic en WhatsApp, envío de formulario)",
    ],
  },
  {
    key: "conversion",
    href: "/conversion",
    label: "Conversión",
    description: "Cuántas visitas terminan en lead y en cliente.",
    source: "GA4 + CRM",
    planned: [
      "Embudo: visitas → leads → presupuestos enviados → aceptados",
      "Monto cotizado vs. monto cerrado (convertido a COP)",
      "Tasa de conversión por canal, campaña y landing",
      "Costo por lead (cuando se conecten Meta / Google Ads)",
    ],
  },
  {
    key: "redes",
    href: "/redes",
    label: "Redes sociales",
    description: "Rendimiento de Instagram y TikTok.",
    source: "Instagram Graph API · TikTok API (snapshots diarios)",
    planned: [
      "Seguidores y crecimiento diario",
      "Alcance, impresiones e interacciones",
      "Top publicaciones por engagement",
      "Tráfico que llega a la web desde cada red",
    ],
  },
  {
    key: "ajustes",
    href: "/ajustes",
    label: "Ajustes",
    description: "Conexiones con servicios externos y cuenta.",
    source: "Supabase",
    planned: [
      "Conectar / desconectar Instagram y TikTok (OAuth)",
      "Estado de GA4 y fecha de la última sincronización",
      "Avisos de tokens próximos a vencer",
    ],
  },
];

export function getModule(key: ModuleKey): AdminModule {
  return modules.find((m) => m.key === key)!;
}
