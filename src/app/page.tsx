import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="grid w-full gap-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14 lg:p-14 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
            Des idées à portée de rue
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
            Les messages qui font vivre les lieux.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-zinc-300">
            Drops rassemble des mots, des photos, des recommandations et des
            énigmes partagés autour de vous. Parcourez les découvertes de la
            communauté.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/drops"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-800 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Explorer les drops
              <span aria-hidden="true" className="ml-2">→</span>
            </a>
            <Link
              href="/status"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-bold text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
            >
              État du service
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6 dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-700 dark:text-zinc-300">
            À découvrir
          </h2>
          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            <li className="flex items-start gap-4 py-4 first:pt-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-100">01</span>
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-white">Des mots et des images</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">Des notes et photos partagées par la communauté.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-100">02</span>
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-white">Des idées utiles</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">Des recommandations locales à garder en tête.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4 last:pb-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-100">03</span>
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-white">Des énigmes à résoudre</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">Un autre regard sur les lieux qui vous entourent.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
