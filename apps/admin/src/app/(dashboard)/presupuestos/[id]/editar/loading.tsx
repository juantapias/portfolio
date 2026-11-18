import { FormSkeleton, LoadingRegion, PageHeaderSkeleton, TableSkeleton } from "@/components/skeletons";

/** Formulario de presupuesto: datos generales, ítems y condiciones */
export default function Loading() {
  return (
    <LoadingRegion label="Cargando el presupuesto">
      <PageHeaderSkeleton description={false} back />
      <div className="max-w-4xl space-y-8">
        <FormSkeleton fields={6} textareas={1} className="max-w-none" />
        <TableSkeleton rows={3} cols={4} />
      </div>
    </LoadingRegion>
  );
}
