"use client";

import dynamic from "next/dynamic";
import type { DropLocationMapProps } from "./DropLocationMapView";

const LocationMapView = dynamic(() => import("./DropLocationMapView"), { ssr: false });

export function DropLocationMap(props: DropLocationMapProps) {
  return (
    <div
      role="region"
      aria-label={props.onChange ? "Choisir la position du drop" : "Position du drop sur la carte"}
      className="isolate h-72 overflow-hidden rounded-xl border border-border bg-black sm:h-80"
    >
      <LocationMapView {...props} />
    </div>
  );
}
