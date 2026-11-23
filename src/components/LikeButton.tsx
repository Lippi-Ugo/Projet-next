"use client";

import { useActionState, useOptimistic } from "react";
import { toggleLike } from "@/app/drops/actions";

export function LikeButton({ dropId, liked, likesCount }: { dropId: number; liked: boolean; likesCount: number }) {
    const [optimistic, toggle] = useOptimistic<{ liked: boolean; likesCount: number }, void>({ liked, likesCount }, (current) => ({
        liked: !current.liked,
        likesCount: current.likesCount + (current.liked ? -1 : 1),
    }));
    const [, action, pending] = useActionState(async () => {
        toggle();
        await toggleLike(dropId, liked);
    }, undefined);

    return (
        <form action={action}>
            <button
                type="submit"
                disabled={pending}
                aria-pressed={optimistic.liked}
                aria-label={`${optimistic.liked ? "Retirer le j’aime" : "Aimer"} (${optimistic.likesCount})`}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-blue-100 hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:text-zinc-200 dark:hover:bg-blue-950 dark:hover:text-blue-100"
            >
                <span aria-hidden="true" className={optimistic.liked ? "text-red-700 dark:text-red-300" : undefined}>
                    {optimistic.liked ? "♥" : "♡"}
                </span>
                <span>{optimistic.likesCount} j’aime</span>
            </button>
        </form>
    );
}
