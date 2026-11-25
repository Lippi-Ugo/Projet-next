import { Suspense } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";
import { Categories } from "./categories";
import { DropList } from "./drop-list";
import { DropListSkeleton } from "@/components/drops/drop-list-skeleton";
import { SearchBox } from "./search-box";
import { requireSession } from "@/lib/session";

type Search = {
  q?: string | string[];
  cat?: string | string[];
  page?: string | string[];
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const metadata = {
  title: "Explorer les drops",
  description: "Parcourez les messages et recommandations partagés autour de vous.",
};

export default function DropsPage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <main className="mx-auto w-full max-w-[96rem] flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <Suspense
        fallback={
          <p
            role="status"
            className="rounded-xl border border-zinc-200 bg-white px-5 py-6 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Chargement de la liste…
          </p>
        }
      >
        <DropsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function DropsContent({ searchParams }: { searchParams: Promise<Search> }) {
  const token = await requireSession();
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const categories = await apiGet<Category[]>("/categories", token);
  const category = categories.find(({ id }) => id === first(params.cat))?.id;
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
        <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          À découvrir
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Les drops
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-700 dark:text-zinc-300">
          Des mots, des images et des idées partagés par la communauté.
        </p>
        <Link href="/drops/new" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          Déposer un drop
        </Link>
      </header>

      <section
        aria-label="Rechercher et filtrer les drops"
        className="mb-8 space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <SearchBox />
        <div>
          <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Catégories
          </h2>
          <nav
            aria-label="Filtrer par catégorie"
            className="flex flex-wrap gap-2"
          >
            <Link
              href={allHref}
              aria-current={category ? undefined : "page"}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                category
                  ? "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  : "border-blue-700 bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              Toutes
            </Link>
            <Categories categories={categories} q={q} selected={category} />
          </nav>
        </div>
      </section>

      <Suspense
        key={`${q}:${category ?? ""}:${page}`}
        fallback={<DropListSkeleton />}
      >
        <DropList q={q} category={category} categories={categories} page={page} token={token} />
      </Suspense>
    </>
  );
}
