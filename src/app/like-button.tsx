"use client";

import { useState } from "react";

type LikeButtonProps = {
    initialLiked: boolean;
    initialCount: number;
};

export default function LikeButton({ initialLiked, initialCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const count = initialCount + (liked === initialLiked ? 0 : liked ? 1 : -1);

    return (
        <button
            type="button"
            aria-pressed={liked}
            aria-label={`${liked ? "Retirer le j’aime" : "Aimer"} (${count})`}
            onClick={() => setLiked((value) => !value)}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-blue-100 hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:text-zinc-200 dark:hover:bg-blue-950 dark:hover:text-blue-100"
        >
            <span aria-hidden="true" className={liked ? "text-blue-700 dark:text-blue-300" : undefined}>
                {liked ? "♥" : "♡"}
            </span>
            <span>{count} j’aime</span>
        </button>
    );
}
