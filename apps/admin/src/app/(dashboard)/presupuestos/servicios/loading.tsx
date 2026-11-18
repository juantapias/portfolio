import { CardSkeleton, ListSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando servicios">
      <PageHeaderSkeleton back />
      <CardSkeleton className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-9 rounded-xl" />
          ))}
        </div>
      </CardSkeleton>
      <div className="rounded-2xl border border-border bg-card px-4">
        <ListSkeleton rows={6} avatar={false} />
      </div>
    </LoadingRegion>
  );
}
