import { Skeleton } from "@/components/ui/skeleton";

export function DropListSkeleton() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Chargement des drops…</span>
      {[1, 2, 3].map((card) => (
        <div key={card} aria-hidden="true" className="space-y-4 rounded-2xl border bg-card p-5">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-3 border-t pt-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
