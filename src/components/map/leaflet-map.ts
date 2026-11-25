import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./drops-map.css";
import type { Drop } from "@/lib/api/types";

export const DROP_MAP_CENTER: L.LatLngTuple = [47.51, 6.8];

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export function createMap(container: HTMLDivElement) {
  const map = L.map(container, { zoomAnimation: false });

  const fallback = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    className: "drops-map-tiles-fallback",
    maxZoom: 19,
    attribution: `${OSM_ATTRIBUTION} contributors`,
  });

  // En ligne, activer Stadia une fois le domaine autorisé.
  const useStadia = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    || process.env.NEXT_PUBLIC_STADIA_MAPS === "true";

  if (useStadia) {
    const toner = L.tileLayer("https://tiles-eu.stadiamaps.com/tiles/stamen_toner_blacklite/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: [
        '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a>',
        '&copy; <a href="https://stamen.com/">Stamen Design</a>',
        '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
        OSM_ATTRIBUTION,
      ].join(" "),
    });
    toner.once("tileerror", () => {
      toner.remove();
      fallback.addTo(map);
    });
    toner.addTo(map);
  } else {
    fallback.addTo(map);
  }

  return map;
}

export function createPin(category: Drop["category"]) {
  return L.icon({
    className: "drop-map-marker",
    iconUrl: `/drop-markers/${category}.svg`,
    iconSize: [38, 46],
    iconAnchor: [19, 45],
  });
}
