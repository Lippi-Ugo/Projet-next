import { DropListSkeleton } from "@/components/drops/drop-list-skeleton";

export default function LoadingDrops() {
  return (
    <main className="mx-auto w-full max-w-[96rem] flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <DropListSkeleton />
    </main>
  );
}
