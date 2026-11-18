import type { NextConfig } from "next";

// El admin es privado y 100% dinámico (todo depende de la sesión), así que
// usamos el modelo clásico de renderizado en vez de Cache Components.
const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/types"],
  // Nada del admin debe indexarse (el proxy añade lo mismo a sus redirecciones)
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
