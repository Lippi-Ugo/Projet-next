import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { apiGet } from "@/lib/api/client";
import type { Category, Drop } from "@/lib/api/types";
import { requireSession } from "@/lib/session";
import { updateDrop } from "../../actions";
import { DropFields } from "@/components/drops/drop-form";
import { EditDropForm } from "@/components/drops/edit-drop-form";

export const metadata = { title: "Modifier un drop" };

async function EditDropContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const token = await requireSession();
  const drop = await apiGet<Drop>(`/drops/${id}`, token);
  const back = <Link href={`/drops/${id}`} className="text-sm text-blue-700 underline dark:text-blue-300">Retour au drop</Link>;
  if (!drop.isMine) {
    return <>{back}<p role="alert" className="mt-4">Seul l’auteur peut modifier ce drop.</p></>;
  }
  const categories = await apiGet<Category[]>("/categories", token);

  return (
    <>
      <div className="mb-4">{back}</div>
      <EditDropForm key={`${drop.id}:${drop.updatedAt}:${drop.category}`} action={updateDrop.bind(null, drop)}>
        <DropFields categories={categories} drop={drop} />
      </EditDropForm>
    </>
  );
}

export default function EditDropPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold">Modifier le drop</h1>
      <Suspense fallback={<p role="status">Chargement du drop…</p>}>
        <EditDropContent params={params} />
      </Suspense>
    </main>
  );
}
