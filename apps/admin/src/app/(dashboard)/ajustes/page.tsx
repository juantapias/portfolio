import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getBusinessProfile } from "@/lib/quote-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "./profile-form";
import { isGoogleConfigured } from "@/lib/google/client";
import { isInstagramConfigured } from "@/lib/social/instagram";
import { getConnection, isTikTokConfigured } from "@/lib/social/tiktok";
import { buttonClass } from "@/components/ui/form";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Ajustes" };

const TIKTOK_MESSAGES: Record<string, { tone: "green" | "red"; text: string }> = {
  conectado: { tone: "green", text: "TikTok quedó conectado." },
  cancelado: { tone: "red", text: "Cancelaste la autorización en TikTok." },
  "estado-invalido": { tone: "red", text: "La solicitud expiró o no es válida. Vuelve a intentarlo." },
  "sin-credenciales": { tone: "red", text: "Faltan las credenciales de la app de TikTok (TIKTOK_CLIENT_KEY / SECRET)." },
  error: { tone: "red", text: "TikTok rechazó la conexión. Revisa que tu cuenta sea usuario de prueba del Sandbox." },
};

export default async function SettingsPage({ searchParams }: PageProps<"/ajustes">) {
  const { tiktok: tiktokStatus } = await searchParams;
  const supabase = await createClient();
  const [profile, tiktok] = await Promise.all([
    getBusinessProfile(supabase),
    isTikTokConfigured() ? getConnection() : Promise.resolve(null),
  ]);
  const message = typeof tiktokStatus === "string" ? TIKTOK_MESSAGES[tiktokStatus] : undefined;

  return (
    <>
      <PageHeader title="Ajustes" description="Tus datos como emisor e integraciones." />

      <Card title="Perfil del emisor" className="mb-6">
        <p className="-mt-1 mb-5 text-sm text-muted">Aparece en el encabezado de tus presupuestos.</p>
        <ProfileForm profile={profile} />
      </Card>

      <Card title="Integraciones">
        {message && (
          <p
            role="status"
            className={`mb-3 rounded-md px-3 py-2 text-sm ${message.tone === "green" ? "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}
          >
            {message.text}
          </p>
        )}
        <ul className="divide-y divide-border text-sm">
          <li className="flex items-center justify-between gap-4 py-3">
            <span>Google Analytics 4 + Search Console</span>
            <Badge tone={isGoogleConfigured() ? "green" : "neutral"}>{isGoogleConfigured() ? "Conectado" : "Sin configurar"}</Badge>
          </li>
          <li className="flex items-center justify-between gap-4 py-3">
            <span>Instagram <span className="text-muted">· token de sistema, no caduca</span></span>
            <Badge tone={isInstagramConfigured() ? "green" : "neutral"}>{isInstagramConfigured() ? "Conectado" : "Sin configurar"}</Badge>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-4 py-3">
            <span>
              TikTok
              {tiktok && (
                <span className="text-muted">
                  {" "}· {tiktok.account_name ?? "cuenta conectada"} · desde {formatDate(tiktok.connected_at)} · reconexión antes del{" "}
                  {formatDate(tiktok.refresh_expires_at)}
                </span>
              )}
            </span>
            {!isTikTokConfigured() ? (
              <Badge tone="neutral">Sin credenciales</Badge>
            ) : (
              <span className="flex items-center gap-2">
                {tiktok && <Badge tone="green">Conectado</Badge>}
                <a href="/api/integrations/tiktok/connect" className={buttonClass(tiktok ? "ghost" : "primary")}>
                  {tiktok ? "Reconectar" : "Conectar TikTok"}
                </a>
              </span>
            )}
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted">Paso a paso en apps/admin/docs/integraciones.md</p>
      </Card>
    </>
  );
}
