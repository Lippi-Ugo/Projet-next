import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api/client";
import type { Category, CommentPage, Drop } from "@/lib/api/types";
import { requireSession } from "@/lib/session";
import { LikeButton } from "@/components/LikeButton";
import { deleteDrop } from "../actions";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export const metadata = {
  title: "Détail d’un drop",
};

export default function DropPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ commentsPage?: string | string[] }> }) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <Suspense
        fallback={
          <p role="status" className="rounded-xl border border-zinc-200 bg-white px-5 py-6 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Chargement du drop…
          </p>
        }
      >
        <DropContent params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function DropContent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ commentsPage?: string | string[] }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const query = await searchParams;
  const requestedPage = Number(
    Array.isArray(query.commentsPage)
      ? query.commentsPage[0]
      : query.commentsPage ?? "1",
  );
  const commentsPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const token = await requireSession();
  const commentsParams = new URLSearchParams({
    page: String(commentsPage),
    pageSize: "20",
  });
  const [categories, drop, comments] = await Promise.all([
    apiGet<Category[]>("/categories", token),
    apiGet<Drop>(`/drops/${id}`, token),
    apiGet<CommentPage>(
      `/drops/${id}/comments?${commentsParams.toString()}`,
      token,
    ),
  ]);
  const categoryLabel = categories.find(({ id }) => id === drop.category)?.label ?? drop.category;

  return (
    <>
      <nav aria-label="Fil d’Ariane" className="mb-6">
        <Link
          href="/drops"
          className="rounded-sm text-sm font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          ← Retour aux drops
        </Link>
      </nav>

      <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-6 sm:px-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
              {categoryLabel}
            </span>
            {drop.isMine && (
              <span className="rounded-full bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Votre drop
              </span>
            )}
            {drop.hidden && (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                Masqué aux autres
              </span>
            )}
          </div>
          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            {drop.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Publié{" "}
            <time dateTime={drop.createdAt}>
              le {dateFormatter.format(new Date(drop.createdAt))}
            </time>
            {drop.updatedAt !== drop.createdAt && (
              <>
                {" · Modifié "}
                <time dateTime={drop.updatedAt}>
                  le {dateFormatter.format(new Date(drop.updatedAt))}
                </time>
              </>
            )}
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3">
            {drop.author.avatarUrl ? (
              <Image
                src={drop.author.avatarUrl}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="size-12 rounded-full bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-100"
              >
                {drop.author.displayName.slice(0, 1).toLocaleUpperCase("fr-FR")}
              </span>
            )}
            <p className="min-w-0 text-sm">
              <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-100">
                {drop.author.displayName}
              </span>
              <span className="block truncate text-zinc-600 dark:text-zinc-400">
                @{drop.author.username}
              </span>
            </p>
          </div>

          {drop.locked ? (
            <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              Le contenu de ce drop est verrouillé.
            </p>
          ) : drop.content ? (
            <p className="mt-6 whitespace-pre-wrap break-words text-base leading-7 text-zinc-800 dark:text-zinc-200">
              {drop.content}
            </p>
          ) : (
            <p className="mt-6 text-sm italic text-zinc-600 dark:text-zinc-400">
              Ce drop ne contient pas de texte.
            </p>
          )}

          {drop.imageUrl && (
            <Image
              src={drop.imageUrl}
              alt={`Image du drop « ${drop.title} »`}
              width={1200}
              height={800}
              unoptimized
              sizes="(max-width: 640px) 100vw, 768px"
              className="mt-6 max-h-[36rem] w-full rounded-2xl bg-zinc-100 object-contain dark:bg-zinc-800"
            />
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                {drop.commentsCount} commentaire
                {drop.commentsCount === 1 ? "" : "s"}
              </span>
              <span className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                Position {drop.location.precision === "exact" ? "exacte" : "approximative"}
              </span>
            </div>
            <LikeButton
              dropId={drop.id}
              key={drop.id}
              liked={drop.likedByMe}
              likesCount={drop.likesCount}
            />
          </div>
        </div>
        {drop.isMine && (
          <div className="flex flex-wrap items-center gap-4 border-t border-zinc-200 px-5 py-4 sm:px-8 dark:border-zinc-800">
            <Link href={`/drops/${drop.id}/edit`} prefetch={false} className="text-sm font-semibold text-blue-700 underline dark:text-blue-300">Modifier le drop</Link>
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-red-700 underline dark:text-red-300">Supprimer le drop</summary>
              <form action={deleteDrop.bind(null, drop.id)} className="mt-2 space-y-2">
                <p>La suppression est définitive.</p>
                <button type="submit" className="rounded-lg bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800">
                  Confirmer la suppression
                </button>
              </form>
            </details>
          </div>
        )}
      </article>

      <section
        aria-labelledby="comments-heading"
        className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 id="comments-heading" className="text-xl font-bold text-zinc-950 dark:text-white">
            Commentaires
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {comments.total} commentaire{comments.total === 1 ? "" : "s"}
          </p>
        </div>

        {comments.items.length === 0 ? (
          <p className="py-8 text-sm text-zinc-600 dark:text-zinc-400">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {comments.items.map((comment) => (
              <li key={comment.id} className="py-5 first:pt-5">
                <article>
                  <header className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {comment.author.displayName}
                      <span className="ml-2 font-normal text-zinc-600 dark:text-zinc-400">
                        @{comment.author.username}
                      </span>
                      {comment.isMine && (
                        <span className="ml-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          Vous
                        </span>
                      )}
                    </p>
                    <time
                      dateTime={comment.createdAt}
                      className="text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      {dateFormatter.format(new Date(comment.createdAt))}
                    </time>
                  </header>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {comment.content}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}

        {comments.totalPages > 1 && (
          <nav
            aria-label="Pagination des commentaires"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800"
          >
            {comments.page > 1 ? (
              <Link
                href={`/drops/${id}?commentsPage=${comments.page - 1}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                ← Précédents
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Page {comments.page} sur {comments.totalPages}
            </span>
            {comments.page < comments.totalPages ? (
              <Link
                href={`/drops/${id}?commentsPage=${comments.page + 1}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                Suivants →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </>
  );
}