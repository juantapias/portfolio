import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getBusinessProfile } from "@/lib/quote-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Ajustes" };

const INTEGRATIONS = [
  { name: "Google Analytics 4", env: "GA4_PROPERTY_ID" },
  { name: "Instagram", env: "META_APP_ID" },
  { name: "TikTok", env: "TIKTOK_CLIENT_KEY" },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const profile = await getBusinessProfile(supabase);

  return (
    <>
      <PageHeader title="Ajustes" description="Tus datos como emisor e integraciones." />

      <Card title="Perfil del emisor" className="mb-6">
        <p className="-mt-1 mb-5 text-sm text-muted">Aparece en el encabezado de tus presupuestos.</p>
        <ProfileForm profile={profile} />
      </Card>

      <Card title="Integraciones">
        <ul className="divide-y divide-border">
          {INTEGRATIONS.map((i) => {
            const configured = Boolean(process.env[i.env]);
            return (
              <li key={i.name} className="flex items-center justify-between py-3 text-sm">
                <span>{i.name}</span>
                <Badge tone={configured ? "green" : "neutral"}>
                  {configured ? "Credenciales cargadas" : "Sin configurar"}
                </Badge>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">Paso a paso en apps/admin/docs/integraciones.md</p>
      </Card>
    </>
  );
}
