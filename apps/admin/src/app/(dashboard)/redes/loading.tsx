"use client";

import { useSearchParams } from "next/navigation";
import { LoadingRegion, PageHeaderSkeleton, SegmentedSkeleton } from "@/components/skeletons";
import { TABS, type Tab } from "./shared";
import { TabSkeleton } from "./skeletons";

/** Lee la pestaña de la URL para mostrar desde el primer momento el esqueleto que le corresponde. */
export default function Loading() {
  const red = useSearchParams().get("red");
  const tab: Tab = TABS.includes(red as Tab) ? (red as Tab) : "general";

  return (
    <LoadingRegion label="Cargando redes sociales">
      {/* Horarios no tiene selector de periodo */}
      <PageHeaderSkeleton eyebrow aside={tab !== "horarios" && <SegmentedSkeleton items={2} small />} />
      <SegmentedSkeleton items={4} active={TABS.indexOf(tab)} className="mb-6" />
      <TabSkeleton tab={tab} />
    </LoadingRegion>
  );
}
