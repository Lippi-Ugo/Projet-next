import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";
import type { Drop, DropPage } from "@/lib/api/types";
import LikeButton from "../like-button";
import { DropExcerpt } from "./drop-excerpt";

type DropListProps = {
  q?: string;
  category?: Drop["category"];
  page?: number;
  token: string;
};

const categoryLabels: Record<Drop["category"], string> = {
  note: "Un mot",
  photo: "Une photo",
  tip: "Une recommandation",
  riddle: "Une énigme",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export async function DropList({
  q = "",
  category,
  page = 1,
  token,
}: DropListProps) {
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
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {data.total} résultat{data.total === 1 ? "" : "s"}
        </h2>
        {(q || category) && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Filtre actif
            {category ? ` · ${categoryLabels[category]}` : ""}
            {q ? ` · « ${q} »` : ""}
          </p>
        )}
      </div>

      {data.items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Aucun drop trouvé
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Essayez un autre terme ou choisissez une autre catégorie.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {data.items.map((drop) => (
            <li
              key={drop.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 border-t-4 border-t-blue-800 bg-white shadow-sm transition-shadow duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:border-t-blue-500 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <article className="p-5 sm:p-7">
                <header>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
                      {categoryLabels[drop.category]}
                    </span>
                    <time
                      dateTime={drop.createdAt}
                      className="text-xs font-medium text-zinc-600 dark:text-zinc-300"
                    >
                      {dateFormatter.format(new Date(drop.createdAt))}
                    </time>
                  </div>
                  <h3 className="mt-4 wrap-break-words text-xl font-bold leading-snug tracking-tight text-zinc-950 sm:text-2xl dark:text-white">
                    <Link
                      href={`/drops/${drop.id}`}
                      className="rounded-sm hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:hover:text-blue-300"
                    >
                      {drop.title}
                    </Link>
                  </h3>
                </header>

                {drop.locked ? (
                  <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    Ce drop est verrouillé.
                  </p>
                ) : (
                  <DropExcerpt content={drop.content} />
                )}

                {drop.imageUrl && (
                  <Image
                    src={drop.imageUrl}
                    alt={`Image du drop « ${drop.title} »`}
                    width={1200}
                    height={800}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 768px"
                    className="mt-5 max-h-[28rem] w-full rounded-xl bg-zinc-100 object-cover dark:bg-zinc-800"
                  />
                )}

                <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Par{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {drop.author.displayName}
                    </span>
                    <span className="ml-1 text-zinc-500">
                      @{drop.author.username}
                    </span>
                  </p>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-zinc-600 dark:text-zinc-300">
                    <LikeButton
                      key={`${drop.id}:${drop.likedByMe}:${drop.likesCount}`}
                      initialLiked={drop.likedByMe}
                      initialCount={drop.likesCount}
                    />
                    <span className="rounded-lg px-2.5 py-2">
                      {drop.commentsCount} commentaire
                      {drop.commentsCount === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-lg px-2.5 py-2">
                      {drop.opensCount} ouverture{drop.opensCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      )}

      {data.totalPages > 1 && (
        <nav
          aria-label="Pagination des drops"
          className="mt-7 flex flex-wrap items-center justify-between gap-3"
        >
          {data.page > 1 ? (
            <Link
              href={pageHref(data.page - 1)}
              className="inline-flex min-h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              ← Précédent
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Page {data.page} sur {data.totalPages}
          </span>
          {data.page < data.totalPages ? (
            <Link
              href={pageHref(data.page + 1)}
              className="inline-flex min-h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
