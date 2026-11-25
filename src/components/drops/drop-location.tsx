import type { Drop } from "@/lib/api/types";

export function DropLocation({ location }: { location?: Drop["location"] }) {
  return (
    <figcaption aria-live="polite" aria-atomic="true" className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-1 text-xs text-muted-foreground empty:mt-0">
      {location && (
        <>
          <span className="whitespace-nowrap tabular-nums">Latitude {location.lat}</span>
          <span className="whitespace-nowrap tabular-nums">Longitude {location.lng}</span>
        </>
      )}
    </figcaption>
  );
}
