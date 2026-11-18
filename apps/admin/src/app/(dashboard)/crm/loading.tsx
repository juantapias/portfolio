import { BoardSkeleton, LoadingRegion, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Cargando leads">
      <PageHeaderSkeleton actions={1} />
      <BoardSkeleton />
    </LoadingRegion>
  );
}
