"use client";

import { useState } from "react";
import { DropCard } from "@/app/drops/drop-card";
import { DropLocation } from "@/components/drops/drop-location";
import { DropsMap } from "@/components/map/DropsMap";
import type { Category, Drop } from "@/lib/api/types";

export function DropsExplorer({ drops, categories }: { drops: Drop[]; categories: Category[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const location = drops.find((drop) => drop.id === activeId)?.location;

  function selectFromMap(id: number) {
    setActiveId(id);
    document.getElementById(`drop-${id}`)?.scrollIntoView({ block: "nearest" });
  }

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-8">
      <ul className="min-w-0 space-y-5">
        {drops.map((drop) => (
          <DropCard
            key={drop.id}
            drop={drop}
            categoryLabel={categories.find(({ id }) => id === drop.category)?.label ?? drop.category}
            active={drop.id === activeId}
            onActivate={() => setActiveId(drop.id)}
          />
        ))}
      </ul>

      <figure className="order-first min-w-0 self-start lg:order-none lg:sticky lg:top-4">
        <div
          role="region"
          aria-label="Carte des drops"
          className="isolate h-80 overflow-hidden rounded-2xl border border-border bg-black shadow-sm lg:h-[80vh]"
        >
          <DropsMap drops={drops} activeId={activeId} onSelect={selectFromMap} />
        </div>
        <DropLocation location={location} />
      </figure>
    </div>
  );
}
