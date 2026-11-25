"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Drop } from "@/lib/api/types";
import { createMap, createPin, DROP_MAP_CENTER } from "./leaflet-map";

export type DropLocationMapProps = {
  location?: Drop["location"];
  category: Drop["category"];
  onChange?: (location: Drop["location"]) => void;
};

export default function DropLocationMapView({ location, category, onChange }: DropLocationMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const lat = location?.lat;
  const lng = location?.lng;

  useEffect(() => {
    const map = createMap(container.current!);
    const marker = L.marker(DROP_MAP_CENTER, {
      draggable: Boolean(onChange),
      interactive: Boolean(onChange),
      autoPan: true,
      keyboard: false,
      alt: "Position du drop",
    });
    mapRef.current = map;
    markerRef.current = marker;

    if (onChange) {
      marker.on("dragend", () => {
        const point = marker.getLatLng();
        const wrapped = point.wrap();
        const lat = Number(wrapped.lat.toFixed(6));
        const lng = Number(wrapped.lng.toFixed(6));
        if (point.lng < -180 || point.lng > 180) map.panTo(wrapped, { animate: false });
        marker.setLatLng([lat, lng]);
        onChange({ lat, lng });
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    markerRef.current?.setIcon(createPin(category));
  }, [category, onChange]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    if (lat === undefined || lng === undefined) {
      if (map.getZoom() === undefined) {
        map.setView(DROP_MAP_CENTER, 13);
        if (onChange) marker.addTo(map);
      }
      return;
    }

    const point = L.latLng(lat, lng);
    if (!map.hasLayer(marker)) {
      map.setView(point, 16);
    } else if (!marker.getLatLng().equals(point, 0)) {
      map.panTo(point, { animate: false });
    }
    marker.setLatLng(point).addTo(map);
  }, [lat, lng, onChange]);

  return <div ref={container} className="drops-map h-full w-full" />;
}
