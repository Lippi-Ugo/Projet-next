"use client";

export default function DropsError({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/30">
        <h1 className="text-xl font-semibold text-red-800 dark:text-red-200">
          Impossible de charger les drops
        </h1>
        <p role="alert" className="mt-2 text-sm leading-6 text-red-800 dark:text-red-200">
          Vérifiez votre connexion et la configuration de l’API, puis réessayez.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Réessayer
        </button>
      </section>
    </main>
  );
}
