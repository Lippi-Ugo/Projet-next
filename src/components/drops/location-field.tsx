"use client"
import { useState } from "react";
import { useGeolocalisation } from "@/lib/use-geolocalisation";

const inputClass = "w-full rounded-lg border border-zinc-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-zinc-600 dark:bg-zinc-950";

export function LocationField({ initialLat, initialLng, showTestPosition }: { initialLat?: number; initialLng?: number; showTestPosition: boolean }) {
    const { status, locate } = useGeolocalisation();
    const [lat, setLat] = useState(String(initialLat ?? ""));
    const [lng, setLng] = useState(String(initialLng ?? ""));

    return (
        <div className="space-y-2">
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label htmlFor="drop-lat">Latitude</label>
                    <input id="drop-lat" name="lat" type="number" step="any" required min={-90} max={90} value={lat}
                        onChange={(event) => setLat(event.target.value)} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="drop-lng">Longitude</label>
                    <input id="drop-lng" name="lng" type="number" step="any" required min={-180} max={180} value={lng}
                        onChange={(event) => setLng(event.target.value)} className={inputClass} />
                </div>
            </div>
            <div className="flex flex-wrap gap-x-4">
                <button type="button" onClick={() => locate(({ lat, lng }) => {
                    setLat(lat.toFixed(6));
                    setLng(lng.toFixed(6));
                })}
                    disabled={status === "loading"}
                    className="min-h-10 text-sm font-medium text-blue-700 underline disabled:opacity-60 dark:text-blue-300">
                    {status === "loading" ? "Localisation…" : "Utiliser ma position"}
                </button>
                {showTestPosition && (
                    <button type="button" disabled={status === "loading"} onClick={() => {
                        setLat("47.495472");
                        setLng("6.805279");
                    }} className="min-h-10 text-sm font-medium text-blue-700 underline disabled:opacity-60 dark:text-blue-300">
                        Utiliser les coordonnées de test du département
                    </button>
                )}
            </div>
            {status === "denied" && <p role="status" className="text-sm text-red-700 dark:text-red-300">Accès à la position refusé. Saisissez les coordonnées manuellement.</p>}
            {status === "unavailable" && <p role="status" className="text-sm text-red-700 dark:text-red-300">La géolocalisation n’est pas disponible sur ce navigateur.</p>}
            {status === "error" && <p role="status" className="text-sm text-red-700 dark:text-red-300">Impossible d’obtenir votre position. Réessayez ou saisissez les coordonnées manuellement.</p>}
        </div>
    );
}
