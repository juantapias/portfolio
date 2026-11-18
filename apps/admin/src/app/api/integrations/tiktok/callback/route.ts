import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { connectWithCode } from "@/lib/social/tiktok";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = (status: string) => NextResponse.redirect(new URL(`/ajustes?tiktok=${status}`, request.url));

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return NextResponse.redirect(new URL("/login", request.url));

  const jar = await cookies();
  const expected = jar.get("tiktok_oauth_state")?.value;
  jar.delete({ name: "tiktok_oauth_state", path: "/api/integrations/tiktok" });

  if (url.searchParams.get("error")) return back("cancelado");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || !expected || state !== expected) return back("estado-invalido");

  try {
    await connectWithCode(code);
    return back("conectado");
  } catch (e) {
    console.error("[tiktok] callback", (e as Error).message);
    return back("error");
  }
}
