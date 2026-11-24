"use client";

import { useEffect, useEffectEvent } from "react";
import { retain, subscribe, type RealtimeEvents } from "@/lib/realtime";

export function useRealtimeEvent<Type extends keyof RealtimeEvents>(
  type: Type,
  onMessage: (data: RealtimeEvents[Type]) => void,
) {
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const unsubscribe = subscribe(type, (data) => handleMessage(data));
    const release = retain();

    return () => {
      unsubscribe();
      release();
    };
  }, [type]);
}
