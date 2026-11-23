"use client";

import { useFormStatus } from "react-dom";

export function CommentFields() {
  const { pending } = useFormStatus();

  return (
    <>
      <label htmlFor="comment-content" className="block text-sm font-semibold">Votre commentaire</label>
      <textarea
        id="comment-content"
        name="content"
        rows={3}
        required
        maxLength={500}
        readOnly={pending}
        aria-describedby="comment-count"
        className="w-full rounded-xl border border-zinc-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-zinc-600 dark:bg-zinc-950"
      />
      <p id="comment-count" className="text-sm text-zinc-600 dark:text-zinc-300">500 caractères maximum</p>
      <button type="submit" disabled={pending} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60">
        {pending ? "Publication…" : "Commenter"}
      </button>
    </>
  );
}
