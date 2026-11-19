import type { Metadata } from "next";
import { Suspense } from "react";
import { Camera, Clock, LayoutGrid, Music2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedNav } from "@/components/ui/segmented-nav";
import { ScheduleTab } from "./horarios";
import { InstagramTab } from "./instagram";
import { OverviewTab } from "./overview";
import { TikTokTab } from "./tiktok";
import { RANGES, TABS, type Range, type Tab } from "./shared";
import { TabSkeleton } from "./skeletons";

export const metadata: Metadata = { title: "Redes sociales" };

const TAB_LABELS: Record<Tab, { label: string; description: string }> = {
  general: { label: "General", description: "Instagram y TikTok lado a lado." },
  instagram: {
    label: "Instagram",
    description:
      "Alcance, publicaciones y lo que llega a tu web desde Instagram.",
  },
  tiktok: {
    label: "TikTok",
    description: "Seguidores, videos y lo que llega a tu web desde TikTok.",
  },
  horarios: {
    label: "Horarios",
    description:
      "Cuándo está conectada tu audiencia y a qué hora te funciona publicar.",
  },
};

export default async function SocialPage({
  searchParams,
}: PageProps<"/redes">) {
  const params = await searchParams;
  const r = Number(params.rango);
  const range: Range = RANGES.includes(r as Range) ? (r as Range) : 28;
  const tab: Tab = TABS.includes(params.red as Tab)
    ? (params.red as Tab)
    : "general";

  // El estado vive en la URL: cada pestaña se puede enlazar y conserva el periodo
  const href = (red: Tab, rango: Range) =>
    `/redes?${new URLSearchParams({ ...(red !== "general" && { red }), rango: String(rango) })}`;

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Redes sociales"
        description={TAB_LABELS[tab].description}
        actions={
          // Horarios siempre usa los últimos 30 días (lo que entrega Instagram): sin selector de periodo
          tab !== "horarios" && (
            <SegmentedNav
              label="Periodo"
              size="sm"
              active={String(range)}
              items={RANGES.map((v) => ({
                key: String(v),
                href: href(tab, v),
                label: `${v} días`,
              }))}
            />
          )
        }
      />

      <SegmentedNav
        label="Red social"
        active={tab}
        className="mb-6"
        items={[
          {
            key: "general",
            href: href("general", range),
            label: "General",
            icon: <LayoutGrid />,
          },
          {
            key: "instagram",
            href: href("instagram", range),
            label: "Instagram",
            icon: <Camera />,
          },
          {
            key: "tiktok",
            href: href("tiktok", range),
            label: "TikTok",
            icon: <Music2 />,
          },
          {
            key: "horarios",
            href: href("horarios", range),
            label: "Horarios",
            icon: <Clock />,
          },
        ]}
      />

      {/* Cada pestaña solo pide los datos que muestra; el esqueleto aparece al instante al cambiar */}
      <Suspense key={`${tab}-${range}`} fallback={<TabSkeleton tab={tab} />}>
        {tab === "instagram" ? (
          <InstagramTab range={range} />
        ) : tab === "tiktok" ? (
          <TikTokTab range={range} />
        ) : tab === "horarios" ? (
          <ScheduleTab />
        ) : (
          <OverviewTab range={range} />
        )}
      </Suspense>
    </>
  );
}
