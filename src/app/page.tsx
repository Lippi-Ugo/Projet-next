import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <section className="max-w-3xl">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Des idées à portée de rue
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
          Les messages qui font vivre les lieux.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Drops rassemble des mots, des photos, des recommandations et des
          énigmes partagés autour de vous. Parcourez les découvertes de la
          communauté.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/drops"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Explorer les drops
          </Link>
          <Link
            href="/status"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            État du service
          </Link>
        </div>
      </section>
    </main>
  );
}
