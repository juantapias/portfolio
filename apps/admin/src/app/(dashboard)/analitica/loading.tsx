import {
  BarListSkeleton,
  CardSkeleton,
  ChartSkeleton,
  LoadingRegion,
  PageHeaderSkeleton,
  StatGridSkeleton,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando analítica">
      <PageHeaderSkeleton actions={1} />
      <Skeleton className="mb-6 h-9 rounded-xl" />
      <StatGridSkeleton />
      <CardSkeleton className="mt-6">
        <ChartSkeleton height={220} bars={28} />
      </CardSkeleton>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i}>
            <BarListSkeleton rows={5} />
          </CardSkeleton>
        ))}
      </div>
      <div className="mt-12 mb-4 space-y-2">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-72 rounded-full" />
      </div>
      <StatGridSkeleton />
    </LoadingRegion>
  );
}
