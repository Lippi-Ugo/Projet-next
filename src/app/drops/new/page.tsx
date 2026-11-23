import Link from "next/link";
import { Suspense } from "react";
import { apiGet } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";
import { requireSession } from "@/lib/session";
import { DropFields } from "@/components/drops/drop-form";
import { SubmitButton } from "@/components/drops/submit-button";
import { createDrop } from "./actions";

export const metadata = { title: "Déposer un drop" };

async function ProtectedForm() {
  const token = await requireSession();
  const categories = await apiGet<Category[]>("/categories", token);
  return (
    <form action={createDrop} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <DropFields categories={categories} />
      <SubmitButton />
    </form>
  );
}

export default function NewDropPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/drops" className="text-sm text-blue-700 underline dark:text-blue-300">Retour aux drops</Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Déposer un drop</h1>
      <Suspense fallback={<p role="status">Chargement du formulaire…</p>}>
        <ProtectedForm />
      </Suspense>
    </main>
  );
}
