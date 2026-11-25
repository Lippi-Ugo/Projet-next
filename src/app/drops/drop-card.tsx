import Image from "next/image";
import Link from "next/link";
import type { Drop } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/LikeButton";
import { UserProfileLink } from "@/components/users/user-profile-link";
import { DropExcerpt } from "./drop-excerpt";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export function DropCard({ drop, categoryLabel }: { drop: Drop; categoryLabel: string }) {
  return (
    <li
      className="overflow-hidden rounded-2xl border border-zinc-200 border-t-4 border-t-blue-800 bg-white shadow-sm transition-shadow duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:border-t-blue-500 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <article className="p-5 sm:p-7">
        <header>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="outline" className="h-auto border-blue-200 bg-blue-50 px-3 py-1 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
              {categoryLabel}
            </Badge>
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

        <DropExcerpt content={drop.content} />

        {drop.imageUrl && (
          <Image
            src={drop.imageUrl}
            alt={`Image du drop « ${drop.title} »`}
            width={1200}
            height={800}
            unoptimized
            sizes="(max-width: 640px) 100vw, 768px"
            className="mt-5 max-h-112 w-full rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
          />
        )}

        <footer className="mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="flex min-w-0 items-center gap-3">
            <UserProfileLink user={drop.author} />
          </div>
          <div className="flex flex-wrap items-center gap-1 self-start rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-xs font-medium text-zinc-800 sm:self-auto dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
            <LikeButton
              dropId={drop.id}
              liked={drop.likedByMe}
              likesCount={drop.likesCount}
            />
            <span className="inline-flex min-h-9 items-center px-2.5">
              {drop.commentsCount} commentaire
              {drop.commentsCount === 1 ? "" : "s"}
            </span>
          </div>
        </footer>
      </article>
    </li>
  );
}
