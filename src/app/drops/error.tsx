"use client";

import Link from "next/link";

export default function DropsError() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold">Une erreur est survenue.</h1>
      <Link href="/" className="mt-4 inline-block text-blue-700 underline dark:text-blue-300">
        Retour à l’accueil
      </Link>
    </main>
  );
}
