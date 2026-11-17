"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onSearch = useDebouncedCallback((q: string) => {
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    next.delete("page");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, 300);

  return (
    <input
      type="search"
      aria-label="Rechercher un drop"
      defaultValue={params.get("q") ?? ""}
      onChange={(event) => onSearch(event.target.value)}
      placeholder="Rechercher un drop…"
      className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
    />
  );
}
