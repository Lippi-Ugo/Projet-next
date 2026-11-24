import { Suspense } from "react";
import Link from "next/link";
import { logout } from "@/lib/action/auth";
import { ApiError, apiGet } from "@/lib/api/client";
import type { PrivateUser } from "@/lib/api/types";
import { getSession } from "@/lib/session";
import { ProfileAvatar } from "./profile-avatar";

function LoginButton() {
  return (
    <Link
      href="/login"
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      Connexion
    </Link>
  );
}

async function SessionNavigation() {
  const token = await getSession();

  if (!token) return <LoginButton />;

  let user: PrivateUser | null = null;
  try {
    user = await apiGet<PrivateUser>("/auth/me", token);
  } catch (error) {
    if (!(error instanceof ApiError || error instanceof TypeError)) throw error;
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profil"
        aria-label="Mon profil"
        title="Mon profil"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:ring-2 hover:ring-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      >
        <ProfileAvatar user={user} />
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-200"
        >
          Déconnexion
        </button>
      </form>
    </div>
  );
}

export function AccountNavigation() {
  return (
    <Suspense fallback={<LoginButton />}>
      <SessionNavigation />
    </Suspense>
  );
}
