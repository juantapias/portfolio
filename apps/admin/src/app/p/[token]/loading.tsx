import { LoadingRegion, QuoteDocumentSkeleton } from "@/components/skeletons";

/** Presupuesto público (lo ve el cliente) */
export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <LoadingRegion label="Cargando el presupuesto">
        <QuoteDocumentSkeleton />
      </LoadingRegion>
    </main>
  );
}
