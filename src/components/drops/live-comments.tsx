"use client";

import { useRouter } from "next/navigation";
import { useRealtimeEvent } from "@/hooks/use-realtime-event";

export function LiveComments({ dropId }: { dropId: number }) {
  const router = useRouter();

  useRealtimeEvent("comment:created", ({ comment }) => {
    if (comment.dropId === dropId) router.refresh();
  });

  useRealtimeEvent("comment:deleted", (data) => {
    if (data.dropId === dropId) router.refresh();
  });

  return null;
}
