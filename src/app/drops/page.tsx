import { Suspense } from "react";
import Link from "next/link";
import type { Drop } from "@/lib/api/types";
import { Categories } from "./categories";
import { DropList } from "./drop-list";
import { SearchBox } from "./search-box";

type Search = {
  q?: string | string[];
  cat?: string | string[];
  page?: string | string[];
};

type PageProps = { searchParams: Promise<Search> };

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const metadata = {
  title: "Explorer les drops",
  description: "Parcourez les messages et recommandations partagés autour de vous.",
};

export default function DropsPage({ searchParams }: PageProps) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<p role="status">Chargement de la liste…</p>}>
        <DropsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function DropsContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const categories: Drop["category"][] = ["note", "photo", "tip", "riddle"];
  const category = categories.find((id) => id === first(params.cat));
  const requestedPage = Number(first(params.page) ?? "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const all = new URLSearchParams();
  if (q) all.set("q", q);
  const allHref = all.size ? `/drops?${all.toString()}` : "/drops";

  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          À découvrir
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Les drops
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300">
          Des mots, des images et des idées partagés par la communauté.
        </p>
      </header>

      <section
        aria-label="Rechercher et filtrer les drops"
        className="mb-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <SearchBox key={q} />
        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Catégories
          </h2>
          <nav aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
            <Link
              href={allHref}
              aria-current={category ? undefined : "page"}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                category
                  ? "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  : "border-blue-700 bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              Toutes
            </Link>
            <Suspense
              fallback={
                <span className="px-2 py-1.5 text-sm text-zinc-500">
                  Chargement des catégories…
                </span>
              }
            >
              <Categories q={q} selected={category} />
            </Suspense>
          </nav>
        </div>
      </section>

      <Suspense
        key={`${q}:${category ?? ""}:${page}`}
        fallback={
          <p role="status" className="py-8 text-sm text-zinc-500">
            Chargement des drops…
          </p>
        }
      >
        <DropList q={q} category={category} page={page} />
      </Suspense>
    </>
  );
}
