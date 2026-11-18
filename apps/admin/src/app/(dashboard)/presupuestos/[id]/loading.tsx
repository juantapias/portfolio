import { LoadingRegion, QuoteDocumentSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/** Detalle de un presupuesto: cabecera, acciones de estado y el documento */
export default function Loading() {
  return (
    <LoadingRegion label="Cargando el presupuesto">
      <Skeleton className="h-4 w-28 rounded-full" />
      <div className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-72 rounded-lg" />
          <Skeleton className="h-4 w-52 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="mb-6 h-14 rounded-2xl" />
      <QuoteDocumentSkeleton />
    </LoadingRegion>
  );
}
