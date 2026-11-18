import { CardSkeleton, ListSkeleton, LoadingRegion } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/** Detalle de un lead */
export default function Loading() {
  return (
    <LoadingRegion label="Cargando el lead">
      <Skeleton className="h-4 w-16 rounded-full" />
      <div className="mt-3 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardSkeleton>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-4 w-40 rounded-full" />
                </div>
              ))}
            </div>
          </CardSkeleton>
          <CardSkeleton>
            <Skeleton className="h-16 rounded-xl" />
            <div className="mt-6 border-l border-border pl-4">
              <ListSkeleton rows={4} avatar={false} />
            </div>
          </CardSkeleton>
        </div>
        <div className="space-y-6">
          <CardSkeleton>
            <div className="space-y-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                </div>
              ))}
            </div>
          </CardSkeleton>
          <CardSkeleton>
            <ListSkeleton rows={2} avatar={false} />
          </CardSkeleton>
        </div>
      </div>
    </LoadingRegion>
  );
}
