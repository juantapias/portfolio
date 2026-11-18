import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    // Todo excepto estáticos, imágenes, endpoints de cron/OAuth/públicos (se validan aparte)
    // y los presupuestos públicos /p/<token>
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest|api/cron|api/integrations|api/public|p/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
