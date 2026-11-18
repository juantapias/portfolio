import { FormSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando el lead">
      <PageHeaderSkeleton description={false} back />
      <FormSkeleton fields={8} textareas={1} />
    </LoadingRegion>
  );
}
