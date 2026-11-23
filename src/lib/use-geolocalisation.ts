"use client"
import {useCallback, useState} from "react";
type Status = "idle" | "loading" | "success" | "denied" | "unavailable" | "error"
type Cords = { lat: number, lng: number };

export function useGeolocalisation() {
    const [status, setStatus] = useState<Status>("idle");
    const locate = useCallback((onSuccess: (coords: Cords) => void) => {
        if (!("geolocation" in navigator)) {
            setStatus ("unavailable");
            return;
        }
        setStatus("loading");
        navigator.geolocation.getCurrentPosition(
            ({coords: c}) => {
                onSuccess({lat: c.latitude, lng: c.longitude});
                setStatus("success");
            },
            (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    }, []);
    return {status, locate};
}
