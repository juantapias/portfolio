import { ListSkeleton, LoadingRegion, PageHeaderSkeleton, SegmentedSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando notificaciones">
      <PageHeaderSkeleton actions={1} />
      <SegmentedSkeleton items={6} className="mb-6 max-w-full overflow-hidden" />
      <div className="space-y-8">
        {[4, 3].map((rows, i) => (
          <section key={i}>
            <Skeleton className="mb-3 h-3 w-24 rounded-full" />
            <div className="rounded-2xl border border-border bg-card px-4">
              <ListSkeleton rows={rows} />
            </div>
          </section>
        ))}
      </div>
    </LoadingRegion>
  );
}
