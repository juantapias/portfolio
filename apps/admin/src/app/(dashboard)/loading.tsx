import {
  CardSkeleton,
  ChartSkeleton,
  ListSkeleton,
  LoadingRegion,
  PageHeaderSkeleton,
  StatGridSkeleton,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/** Resumen */
export default function Loading() {
  return (
    <LoadingRegion label="Cargando el resumen">
      <PageHeaderSkeleton eyebrow />
      <StatGridSkeleton />
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <CardSkeleton action className="lg:col-span-8">
          <Skeleton className="mb-8 h-8 w-40 rounded-lg" />
          <ChartSkeleton bars={8} />
        </CardSkeleton>
        <CardSkeleton className="lg:col-span-4">
          <Skeleton className="mb-6 h-8 w-32 rounded-lg" />
          <Skeleton className="h-3 rounded-full" />
          <ListSkeleton rows={5} avatar={false} />
        </CardSkeleton>
      </div>
      <div className="mt-8 mb-4 space-y-2">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-7 w-40 rounded-lg" />
      </div>
      <StatGridSkeleton />
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <CardSkeleton className="lg:col-span-7">
          <ListSkeleton rows={5} />
        </CardSkeleton>
        <CardSkeleton action className="lg:col-span-5">
          <ListSkeleton rows={4} avatar={false} />
        </CardSkeleton>
      </div>
    </LoadingRegion>
  );
}
