import { Suspense } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/client";
import type { Health } from "@/lib/api/types";

export const metadata = {
  title: "État du service",
  description: "État en temps réel de l’API Drops.",
};

export default function StatusPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Informations système
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          État du service
        </h1>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
          Cette page vérifie la réponse réelle de l’API et de sa base de données.
        </p>
      </header>
      <Suspense
        fallback={
          <div
            role="status"
            className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Vérification de l’API en cours…
          </div>
        }
      >
        <HealthStatus />
      </Suspense>
    </main>
  );
}

async function HealthStatus() {
  let health: Health;
  try {
    health = await apiGet<Health>("/health");
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    return (
      <section
        aria-labelledby="health-title"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/30"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 dark:bg-red-900/60 dark:text-red-200"
          >
            !
          </span>
          <div>
            <h2
              id="health-title"
              className="text-lg font-semibold text-red-800 dark:text-red-200"
            >
              API indisponible
            </h2>
            <p role="alert" className="mt-2 text-sm leading-6 text-red-800 dark:text-red-200">
              La vérification n’a pas abouti. Vérifiez votre connexion ou réessayez
              plus tard.
            </p>
            <p className="mt-2 break-words text-xs text-red-700/80 dark:text-red-300/80">
              Détail : {error.message}
            </p>
            <Link
              href="/status"
              className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-red-300 bg-white px-4 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:border-red-800 dark:bg-zinc-950 dark:text-red-200 dark:hover:bg-red-950"
            >
              Vérifier à nouveau
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isHealthy = health.status === "ok" && health.db === "ok";
  const checkedAt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(health.time));
  const uptimeHours = Math.floor(health.uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((health.uptimeSeconds % 3600) / 60);

  return (
    <section
      aria-labelledby="health-title"
      className={`rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-900 ${
        isHealthy
          ? "border-emerald-200 dark:border-emerald-900"
          : "border-amber-200 dark:border-amber-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1.5 size-3 shrink-0 rounded-full ${
            isHealthy ? "bg-emerald-600" : "bg-amber-500"
          }`}
        />
        <div className="min-w-0 flex-1">
          <h2
            id="health-title"
            className="text-lg font-semibold text-zinc-950 dark:text-white"
          >
            {isHealthy ? "Tous les systèmes sont opérationnels" : "Service dégradé"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {isHealthy
              ? "L’API et sa base de données répondent correctement."
              : "L’API ou sa base de données signale un problème. Certaines fonctions peuvent être indisponibles."}
          </p>
          <dl className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 text-sm sm:grid-cols-2 dark:border-zinc-800">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">API</dt>
              <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                {health.service} · {health.status === "ok" ? "Opérationnelle" : "Dégradée"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Base de données</dt>
              <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                {health.db === "ok" ? "Opérationnelle" : "Erreur"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Version</dt>
              <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                {health.version}
                {health.commit ? ` · ${health.commit}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Disponibilité</dt>
              <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                {uptimeHours} h {uptimeMinutes} min
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">
            Vérifié le {checkedAt}
          </p>
        </div>
      </div>
    </section>
  );
}
