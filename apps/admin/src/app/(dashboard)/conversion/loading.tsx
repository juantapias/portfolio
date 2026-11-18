import {
  CardSkeleton,
  LoadingRegion,
  PageHeaderSkeleton,
  SegmentedSkeleton,
  StatGridSkeleton,
  TableSkeleton,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando conversión">
      <PageHeaderSkeleton aside={<SegmentedSkeleton items={3} small />} />
      <StatGridSkeleton />
      <CardSkeleton className="mt-6">
        <div className="grid gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border p-3">
              <Skeleton className="h-3 w-3/4 rounded-full" />
              <Skeleton className="mt-3 h-7 w-1/2 rounded-lg" />
              <Skeleton className="mt-2 h-2.5 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
      </CardSkeleton>
      <div className="mt-6 space-y-6">
        <TableSkeleton rows={5} cols={5} />
        <TableSkeleton rows={4} cols={5} />
      </div>
    </LoadingRegion>
  );
}
