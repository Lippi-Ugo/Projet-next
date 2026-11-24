"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useRealtimeEvent } from "@/hooks/use-realtime-event";
import type { RealtimeEvents } from "@/lib/realtime";

const messages = {
  drop_opened: "a ouvert ton drop",
  drop_liked: "a aimé ton drop",
  drop_commented: "a commenté ton drop",
} satisfies Record<RealtimeEvents["notification"]["kind"], string>;

export function DropNotifications() {
  const router = useRouter();

  useRealtimeEvent("notification", ({ kind, dropId, dropTitle, by, at }) => {
    const message = messages[kind];
    if (!message) return;

    const id = `${kind}:${dropId}:${by.id}:${at}`;
    const title = `${by.displayName} ${message}`;

    toast(title, {
      id,
      description: <span className="wrap-anywhere">{dropTitle}</span>,
      action: {
        label: "Voir le drop",
        onClick: () => router.push(`/drops/${dropId}`),
      },
    });
  });

  return <Toaster closeButton containerAriaLabel="Notifications Drops" />;
}
