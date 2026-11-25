"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Drop } from "@/lib/api/types";
import { createMap, createPin, DROP_MAP_CENTER } from "./leaflet-map";

const PINS = {
  note: { icon: createPin("note"), label: "Un mot" },
  photo: { icon: createPin("photo"), label: "Une photo" },
  tip: { icon: createPin("tip"), label: "Une recommandation" },
  riddle: { icon: createPin("riddle"), label: "Une énigme" },
};

type Props = {
  drops: Drop[];
  activeId: number | null;
  onSelect: (id: number) => void;
};

export default function DropsMap({ drops, activeId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<number, L.Marker>());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // 1. Créer la carte, une seule fois
  useEffect(() => {
    const map = createMap(container.current!).setView(DROP_MAP_CENTER, 13);
    mapRef.current = map;
    layer.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layer.current = null;
    };
  }, []);

  // 2. Les épingles suivent la liste
  useEffect(() => {
    const map = mapRef.current;
    const group = layer.current;
    if (!map || !group) return;

    group.clearLayers();
    markers.current.clear();

    for (const drop of drops) {
      const pin = PINS[drop.category] ?? PINS.note;
      const selectDrop = () => onSelectRef.current(drop.id);
      const marker = L.marker([drop.location.lat, drop.location.lng], { icon: pin.icon })
        .on("click", selectDrop)
        .addTo(group);

      const element = marker.getElement();
      element?.setAttribute("aria-label", `${pin.label} · ${drop.title}`);
      element?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectDrop();
      });
      markers.current.set(drop.id, marker);
    }

    if (drops.length > 0) {
      const pts = drops.map<L.LatLngTuple>((d) => [d.location.lat, d.location.lng]);
      map.fitBounds(L.latLngBounds(pts), {
        paddingTopLeft: [32, 64],
        paddingBottomRight: [32, 32],
        maxZoom: 16,
      });
    }
  }, [drops]);

  // 3. Mettre en avant l’épingle active et centrer la carte
  useEffect(() => {
    if (activeId === null) return;

    const marker = markers.current.get(activeId);
    if (!marker) return;

    const element = marker.getElement();
    element?.classList.add("drop-map-marker-active");
    marker.setZIndexOffset(1000);
    mapRef.current?.panTo(marker.getLatLng(), { animate: false });

    return () => {
      element?.classList.remove("drop-map-marker-active");
      marker.setZIndexOffset(0);
    };
  }, [activeId, drops]);

  return <div ref={container} className="drops-map h-full w-full rounded-lg" />;
}
