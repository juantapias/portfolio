import { FormSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando el formulario">
      <PageHeaderSkeleton description={false} />
      <FormSkeleton fields={8} textareas={1} />
    </LoadingRegion>
  );
}
