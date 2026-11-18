"use client";

type DropsErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function DropsError({ error, retry }: DropsErrorProps) {
  const sessionRejected =
    error instanceof Error && error.message.startsWith("API 401 sur ");
  const message =
    error instanceof Error
      ? error.message
      : "Une erreur inattendue empêche le chargement des drops.";

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/30">
        <h1 className="text-xl font-semibold text-red-800 dark:text-red-200">
          {sessionRejected
            ? "Le service ne reconnaît pas la session"
            : "Impossible de charger les résultats"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-red-800 dark:text-red-200">
          {sessionRejected
            ? "Le site a une session enregistrée, mais l’API la refuse. Déconnectez-vous puis reconnectez-vous."
            : "La recherche n’a pas abouti. Vérifiez votre connexion, puis réessayez."}
        </p>
        <p role="alert" className="mt-2 break-words text-sm text-red-800 dark:text-red-200">
          Détail : {message}
        </p>
        {digest && (
          <p className="mt-2 text-xs text-red-800 dark:text-red-200">
            Référence : {digest}
          </p>
        )}
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Réessayer
        </button>
      </section>
    </main>
  );
}
