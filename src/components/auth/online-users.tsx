"use client";

import { useOnline } from "@/hooks/use-online";
import { ProfileAvatar } from "./profile-avatar";

export function OnlineUsers() {
  const users = useOnline();

  if (!users) return null;

  return (
    <details>
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        <span aria-live="polite">{users.length} en ligne</span>
      </summary>
      <div className="absolute right-0 top-full z-20 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-md">
        <p className="mb-2 text-sm font-semibold">Utilisateurs en ligne</p>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">Personne en ligne.</p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-2">
                <ProfileAvatar user={user} />
                <div className="min-w-0 wrap-anywhere">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
