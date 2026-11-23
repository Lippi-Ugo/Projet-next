import { Suspense } from "react";
import Link from "next/link";
import { logout } from "@/lib/action/auth";
import { getSession } from "@/lib/session";

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

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
        <span aria-hidden="true" className="size-2 rounded-full bg-emerald-700 dark:bg-emerald-400" />
        Connecté
      </span>
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
