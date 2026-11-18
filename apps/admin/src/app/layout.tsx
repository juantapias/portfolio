import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

/* Las mismas fuentes que la web: Space Grotesk (texto) y Prociono (títulos) */
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const prociono = localFont({
  src: "./fonts/Prociono-Regular.ttf",
  variable: "--font-prociono",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  applicationName: "Admin",
  robots: { index: false, follow: false },
  // Instalada en iOS: pantalla completa, barra de estado sobre el contenido y nombre corto bajo el icono
  appleWebApp: { capable: true, title: "Admin", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // viewport-fit=cover: el contenido llega bajo el notch y la barra de inicio; los márgenes los ponen los safe-area insets
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  // Color de la barra del navegador / del sistema según el tema
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de tema añade la clase .dark antes de hidratar
    <html lang="es" className={`${spaceGrotesk.variable} ${prociono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
