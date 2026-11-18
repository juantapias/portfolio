import { CardSkeleton, ListSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando portfolio">
      <PageHeaderSkeleton />
      <div className="grid gap-4 md:grid-cols-3">
        <CardSkeleton className="md:col-span-2">
          <ListSkeleton rows={4} avatar={false} />
        </CardSkeleton>
        <CardSkeleton>
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="mt-4 h-6 w-28 rounded-full" />
        </CardSkeleton>
      </div>
    </LoadingRegion>
  );
}
