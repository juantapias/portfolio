import {
  LoadingRegion,
  PageHeaderSkeleton,
  SegmentedSkeleton,
  StatGridSkeleton,
  TableSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando presupuestos">
      <PageHeaderSkeleton actions={2} />
      <StatGridSkeleton count={3} className="mb-8" />
      <SegmentedSkeleton items={6} small className="mb-4" />
      <TableSkeleton rows={6} cols={6} />
    </LoadingRegion>
  );
}
