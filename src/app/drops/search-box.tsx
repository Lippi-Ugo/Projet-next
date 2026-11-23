"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onSearch = useDebouncedCallback((input: string) => {
    const q = input.trim();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    next.delete("page");
    const query = next.toString();
    if (query !== params.toString()) {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }, 300);

  return (
    <form
      action="/drops"
      method="get"
      role="search"
      aria-label="Recherche des drops"
      className="flex items-end gap-3"
    >
      {params.get("cat") && <input type="hidden" name="cat" value={params.get("cat") ?? ""} />}
      <div className="min-w-0 flex-1">
        <label
          htmlFor="drop-search"
          className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100"
        >
          Rechercher
        </label>
        <input
          id="drop-search"
          name="q"
          type="search"
          defaultValue={params.get("q") ?? ""}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Titre ou contenu du drop…"
          className="min-h-12 w-full rounded-xl border border-zinc-400 bg-white px-4 text-base text-zinc-950 shadow-sm placeholder:text-zinc-600 focus-visible:border-blue-800 focus-visible:ring-4 focus-visible:ring-blue-800/15 dark:border-zinc-600 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-400"
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Rechercher
      </button>
    </form>
  );
}
