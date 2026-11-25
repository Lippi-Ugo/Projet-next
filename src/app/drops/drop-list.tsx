import Link from "next/link";
import { DropsExplorer } from "@/components/drops/DropsExplorer";
import { apiGet } from "@/lib/api/client";
import type { Category, DropPage } from "@/lib/api/types";

export async function DropList({
  q = "",
  category,
  categories,
  page = 1,
  token,
}: {
  q?: string;
  category?: Category["id"];
  categories: Category[];
  page?: number;
  token: string;
}) {
  const categoryLabels = new Map(categories.map(({ id, label }) => [id, label]));
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (q) params.set("q", q);
  if (category) params.set("category", category);

  const data = await apiGet<DropPage>(
    `/drops?${params.toString()}`,
    token,
  );
  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("cat", category);
    if (nextPage > 1) next.set("page", String(nextPage));
    const query = next.toString();
    return query ? `/drops?${query}` : "/drops";
  };

  return (
    <section aria-label="Résultats des drops">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h2
          aria-live="polite"
          aria-atomic="true"
          className="text-base font-bold text-zinc-950 dark:text-white"
        >
          {data.total} résultat{data.total === 1 ? "" : "s"}
        </h2>
        {(q || category) && (
          <p className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            Filtres actifs
            {category ? ` · ${categoryLabels.get(category) ?? category}` : ""}
            {q ? ` · « ${q} »` : ""}
          </p>
        )}
      </div>

      {data.items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white px-5 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Aucun drop trouvé
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Essayez un autre terme ou choisissez une autre catégorie.
          </p>
        </div>
      ) : (
        <DropsExplorer drops={data.items} categories={categories} />
      )}

      {data.totalPages > 1 && (
        <nav
          aria-label="Pagination des drops"
          className="mt-7 flex flex-wrap items-center justify-between gap-3"
        >
          {data.page > 1 ? (
            <Link
              href={pageHref(data.page - 1)}
              className="inline-flex min-h-10 items-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              ← Précédent
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Page {data.page} sur {data.totalPages}
          </span>
          {data.page < data.totalPages ? (
            <Link
              href={pageHref(data.page + 1)}
              className="inline-flex min-h-10 items-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              Suivant →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
