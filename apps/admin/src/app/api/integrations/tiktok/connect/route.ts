import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUrl, isTikTokConfigured } from "@/lib/social/tiktok";

/** Inicia el OAuth de TikTok. Solo para el admin con sesión (el proxy no cubre /api/integrations). */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return NextResponse.redirect(new URL("/login", request.url));
  if (!isTikTokConfigured()) return NextResponse.redirect(new URL("/ajustes?tiktok=sin-credenciales", request.url));

  const state = randomBytes(24).toString("hex");
  (await cookies()).set("tiktok_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/integrations/tiktok",
    maxAge: 600,
  });
  return NextResponse.redirect(getAuthUrl(state));
}
