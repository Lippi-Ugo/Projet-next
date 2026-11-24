"use client";

import { useActionState, useOptimistic, useState } from "react";
import { toggleLike } from "@/app/drops/actions";
import { useRealtimeEvent } from "@/hooks/use-realtime-event";

type LikeCount = { likesCount: number };

export function LikeButton({ dropId, liked, likesCount }: { dropId: number; liked: boolean; likesCount: number }) {
    const [liveCount, setLiveCount] = useState<LikeCount | null>(null);

    useRealtimeEvent("like:updated", (data) => {
        if (data.dropId === dropId) setLiveCount(data);
    });

    const [optimistic, toggle] = useOptimistic(
        { liked, likesCount: liveCount?.likesCount ?? likesCount, liveCount },
        (current, click: { liked: boolean; previousCount: LikeCount | null }) => {
            // Dès qu’un total arrive du serveur, il remplace le calcul optimiste.
            const predictCount = current.liveCount === click.previousCount && current.liked !== click.liked;
            return {
                ...current,
                liked: click.liked,
                likesCount: predictCount
                    ? Math.max(0, current.likesCount + (click.liked ? 1 : -1))
                    : current.likesCount,
            };
        },
    );
    const [, action, pending] = useActionState(async () => {
        toggle({ liked: !liked, previousCount: liveCount });
        const result = await toggleLike(dropId, liked);
        setLiveCount((current) => current === liveCount ? result : current);
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
