import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { apiGet } from "@/lib/api/client";
import type { Category, CommentPage, Drop } from "@/lib/api/types";
import { requireSession } from "@/lib/session";
import { LikeButton } from "@/components/LikeButton";
import { PresenceWidget } from "@/components/PresenceWidget";
import { DeleteCommentDialog } from "@/components/drops/delete-comment-dialog";
import { UserProfileLink } from "@/components/users/user-profile-link";
import { LiveComments } from "@/components/drops/live-comments";
import { Badge } from "@/components/ui/badge";
import { CommentFields } from "./comment-form";
import { DeleteDropDialog } from "@/components/drops/delete-drop-dialog";
import { addComment } from "../actions";

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
  const lastCommentsPage = Math.max(1, comments.totalPages);
  if (commentsPage > lastCommentsPage) {
    redirect(lastCommentsPage === 1 ? `/drops/${id}` : `/drops/${id}?commentsPage=${lastCommentsPage}`);
  }

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
            <Badge variant="outline" className="h-auto border-blue-200 bg-blue-50 px-3 py-1 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
              {categoryLabel}
            </Badge>
            {drop.isMine && (
              <Badge variant="secondary" className="h-auto px-3 py-1">
                Votre drop
              </Badge>
            )}
            {drop.hidden && (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                Masqué aux autres
              </span>
            )}
          </div>
          <h1 className="mt-4 wrap-anywhere text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <UserProfileLink user={drop.author} />
            </div>
            <PresenceWidget dropId={drop.id} />
          </div>

          {drop.content ? (
            <p className="mt-6 whitespace-pre-wrap wrap-anywhere text-base leading-7 text-zinc-800 dark:text-zinc-200">
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
              className="mt-6 max-h-144 w-full rounded-2xl bg-zinc-100 object-contain dark:bg-zinc-800"
            />
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                {drop.commentsCount} commentaire
                {drop.commentsCount === 1 ? "" : "s"}
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
            <DeleteDropDialog dropId={drop.id} />
          </div>
        )}
      </article>

      <section
        aria-labelledby="comments-heading"
        className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <LiveComments dropId={drop.id} />
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 id="comments-heading" className="text-xl font-bold text-zinc-950 dark:text-white">
            Commentaires
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {comments.total} commentaire{comments.total === 1 ? "" : "s"}
          </p>
        </div>

        <form action={addComment.bind(null, drop.id)} className="space-y-3 border-b border-zinc-200 py-5 dark:border-zinc-800">
          <CommentFields />
        </form>

        {comments.items.length === 0 ? (
          <p className="py-8 text-sm text-zinc-600 dark:text-zinc-400">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {comments.items.map((comment) => (
              <li key={comment.id} className="py-5 first:pt-5">
                <article>
                  <header className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 wrap-anywhere text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                        <span>{comment.author.displayName}</span>
                        <span className="font-normal text-zinc-600 dark:text-zinc-400">
                          @{comment.author.username}
                        </span>
                        {comment.isMine && (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Vous
                          </span>
                        )}
                      </p>
                      <time
                        dateTime={comment.createdAt}
                        className="mt-1 block text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        {dateFormatter.format(new Date(comment.createdAt))}
                      </time>
                    </div>
                    {comment.isMine && <DeleteCommentDialog commentId={comment.id} />}
                  </header>
                  <p className="mt-2 whitespace-pre-wrap wrap-anywhere text-sm leading-6 text-zinc-800 dark:text-zinc-200">
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
