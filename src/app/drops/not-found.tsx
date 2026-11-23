import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Drop introuvable</h1>
      <p className="mt-3">Ce drop est introuvable ou indisponible.</p>
      <Link href="/drops" className="mt-5 inline-flex min-h-10 items-center text-blue-700 underline dark:text-blue-300">
        Retour à la liste des drops
      </Link>
    </main>
  );
}
