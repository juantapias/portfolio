import { CardSkeleton, FormSkeleton, ListSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando ajustes">
      <PageHeaderSkeleton />
      <CardSkeleton className="mb-6">
        <FormSkeleton fields={8} textareas={2} className="max-w-none" />
      </CardSkeleton>
      <CardSkeleton className="mb-6">
        <ListSkeleton rows={5} avatar={false} />
      </CardSkeleton>
      <CardSkeleton>
        <ListSkeleton rows={4} />
      </CardSkeleton>
    </LoadingRegion>
  );
}
