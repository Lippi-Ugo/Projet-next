"use client";

import { useEffect, useRef, useState } from "react";

type NotificationEntry = {
  id: string;
  title: string;
  dropTitle: string;
  dropId: number;
  at: string;
  read: boolean;
};

const MAX_NOTIFICATIONS = 50;

function readHistory(key: string): NotificationEntry[] {
  try {
    const entries = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export function useNotificationHistory(userId?: number) {
  const [history, setHistory] = useState<NotificationEntry[]>([]);
  const unsavedHistory = useRef<NotificationEntry[] | null>(null);
  const key = userId === undefined ? undefined : `drops:notifications:${userId}`;

  useEffect(() => {
    if (!key) return;

    const loadHistory = () => setHistory(unsavedHistory.current ?? readHistory(key));
    loadHistory();

    function onStorage(event: StorageEvent) {
      if (event.key === key || event.key === null) loadHistory();
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  function saveHistory(key: string, entries: NotificationEntry[]) {
    try {
      localStorage.setItem(key, JSON.stringify(entries));
      unsavedHistory.current = null;
    } catch {
      // La cloche reste utilisable quand le navigateur bloque le stockage.
      unsavedHistory.current = entries;
    }
    setHistory(entries);
  }

  function addNotification(entry: Omit<NotificationEntry, "read">) {
    if (!key) return;
    const entries = unsavedHistory.current ?? readHistory(key);
    if (entries.some((notification) => notification.id === entry.id)) return;
    saveHistory(key, [{ ...entry, read: false }, ...entries].slice(0, MAX_NOTIFICATIONS));
  }

  function markRead(id?: string) {
    if (!key) return;
    const entries = unsavedHistory.current ?? readHistory(key);
    const updatedEntries = entries.map((entry) =>
      !id || entry.id === id ? { ...entry, read: true } : entry,
    );
    saveHistory(key, updatedEntries);
  }

  return { history, addNotification, markRead };
}
