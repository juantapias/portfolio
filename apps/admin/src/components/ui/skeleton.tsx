import { cn } from "@/lib/utils";

/** Bloque de carga con un brillo que lo recorre (shimmer). Decorativo: el estado lo anuncia <LoadingRegion>. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-foreground/[0.06] before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
