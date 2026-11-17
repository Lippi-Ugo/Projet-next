import { cacheLife } from "next/cache";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";
import type { Category, Drop } from "@/lib/api/types";

const labels: Record<Drop["category"], string> = {
  note: "Un mot",
  photo: "Une photo",
  tip: "Une recommandation",
  riddle: "Une énigme",
};

export async function Categories({
  q = "",
  selected,
}: {
  q?: string;
  selected?: Drop["category"];
}) {
  "use cache";
  cacheLife("days");

  const list = await apiGet<Category[]>("/categories");

  return list.map((category) => {
    const params = new URLSearchParams({ cat: category.id });
    if (q) params.set("q", q);
    const isSelected = selected === category.id;

    return (
      <Link
        key={category.id}
        href={`/drops?${params}`}
        aria-current={isSelected ? "page" : undefined}
        className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
          isSelected
            ? "border-blue-700 bg-blue-700 text-white hover:bg-blue-800"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        {labels[category.id]}
      </Link>
    );
  });
}
