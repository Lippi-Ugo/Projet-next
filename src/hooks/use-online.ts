"use client";

import { useEffect, useState } from "react";
import type { Viewer } from "./use-presence";
import { retain, subscribe } from "@/lib/realtime";

export function useOnline() {
  const [users, setUsers] = useState<Viewer[] | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe("presence:online", ({ users }) => setUsers(users));
    const release = retain();

    return () => {
      unsubscribe();
      release();
    };
  }, []);

  return users;
}
