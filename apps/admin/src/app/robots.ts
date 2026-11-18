import type { MetadataRoute } from "next";

/**
 * El admin es privado: no se rastrea. Excepción: /p/ (presupuestos compartidos
 * con clientes) se deja rastrear para que Google lea su `noindex` si alguien
 * publica el enlace; bloquearlo haría que pudiera indexarse la URL "a ciegas".
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/", allow: "/p/" },
  };
}
