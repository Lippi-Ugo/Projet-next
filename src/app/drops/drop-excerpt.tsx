"use client";

import { useState } from "react";

export function DropExcerpt({ content }: { content: string | null }) {
  const [open, setOpen] = useState(false);
  const text = content ?? "";
  const isLong = text.length > 180;

  return (
    <div className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
      <p className="whitespace-pre-wrap">
        {text
          ? open || !isLong
            ? text
            : `${text.slice(0, 180).trimEnd()}…`
          : "Aucun contenu textuel pour ce drop."}
      </p>
      {isLong && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="mt-2 rounded-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
        >
          {open ? "Lire moins" : "Lire plus"}
        </button>
      )}
    </div>
  );
}
