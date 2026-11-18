import { LoadingRegion, PageHeaderSkeleton, SegmentedSkeleton } from "@/components/skeletons";
import { TabSkeleton } from "./shared";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando redes sociales">
      <PageHeaderSkeleton eyebrow aside={<SegmentedSkeleton items={2} small />} />
      <SegmentedSkeleton items={3} className="mb-6" />
      <TabSkeleton />
    </LoadingRegion>
  );
}
