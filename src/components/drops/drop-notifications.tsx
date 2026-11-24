"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNotificationHistory } from "@/hooks/use-notification-history";
import { useRealtimeEvent } from "@/hooks/use-realtime-event";
import type { RealtimeEvents } from "@/lib/realtime";

const messages = {
  drop_opened: "a ouvert ton drop",
  drop_liked: "a aimé ton drop",
  drop_commented: "a commenté ton drop",
} satisfies Record<RealtimeEvents["notification"]["kind"], string>;

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function DropNotifications({ userId }: { userId?: number }) {
  const router = useRouter();
  const menu = useRef<HTMLDetailsElement>(null);
  const { history, addNotification, markRead } = useNotificationHistory(userId);
  const unread = history.filter((notification) => !notification.read).length;

  useRealtimeEvent("notification", ({ kind, dropId, dropTitle, by, at }) => {
    const message = messages[kind];
    if (!message) return;

    const id = `${kind}:${dropId}:${by.id}:${at}`;
    const title = `${by.displayName} ${message}`;
    addNotification({ id, title, dropTitle, dropId, at });

    toast(title, {
      id,
      description: <span className="wrap-anywhere">{dropTitle}</span>,
      action: {
        label: "Voir le drop",
        onClick: () => {
          markRead(id);
          router.push(`/drops/${dropId}`);
        },
      },
    });
  });

  return (
    <>
      {userId !== undefined && (
        <details ref={menu} name="account-popovers">
          <summary
            aria-label={unread ? `Notifications (${unread} à lire)` : "Notifications"}
            className="relative flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden"
          >
            <Bell className="size-5" aria-hidden="true" />
            {unread > 0 && (
              <span aria-hidden="true" className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-blue-700 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </summary>
          <div className="absolute right-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover text-popover-foreground shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3">
              <h2 className="text-sm font-semibold">Notifications</h2>
              {unread > 0 && (
                <button type="button" onClick={() => markRead()} className="cursor-pointer text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                  Tout marquer comme lu
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-muted-foreground">Aucune notification pour le moment.</p>
            ) : (
              <ul className="max-h-72 divide-y divide-border overflow-y-auto border-t border-border">
                {history.map(({ id, title, dropTitle, dropId, at, read }) => (
                  <li key={id}>
                    <Link
                      href={`/drops/${dropId}`}
                      onClick={() => {
                        markRead(id);
                        if (menu.current) menu.current.open = false;
                      }}
                      className="flex gap-2 p-3 text-sm hover:bg-muted focus-visible:bg-muted"
                    >
                      <span className="min-w-0 flex-1 wrap-anywhere">
                        <span className={read ? "block" : "block font-semibold"}>{title}</span>
                        <span className="block text-muted-foreground">{dropTitle}</span>
                        {Number.isFinite(Date.parse(at)) && (
                          <time dateTime={at} className="block text-xs text-muted-foreground">
                            {dateFormat.format(new Date(at))}
                          </time>
                        )}
                      </span>
                      {!read && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400">
                          <span className="sr-only">Non lue</span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      )}
      <Toaster closeButton containerAriaLabel="Notifications Drops" />
    </>
  );
}
