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
  token,
}: {
  q?: string;
  selected?: Drop["category"];
  token: string;
}) {
  const list = await apiGet<Category[]>("/categories", token);

  return list.map((category) => {
    const params = new URLSearchParams({ cat: category.id });
    if (q) params.set("q", q);
    const isSelected = selected === category.id;

    return (
      <Link
        key={category.id}
        href={`/drops?${params}`}
        aria-current={isSelected ? "page" : undefined}
        className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
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
