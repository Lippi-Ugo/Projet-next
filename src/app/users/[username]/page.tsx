import Link from "next/link";
import { Suspense } from "react";
import { UserProfile } from "@/components/users/user-profile";

export default function UserPage({params,}: {params: Promise<{ username: string }>;}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link href="/drops" className="mb-6 inline-block underline">
        Retour aux drops
      </Link>

      <Suspense fallback={<p role="status">Chargement du profil…</p>}>
        <UserProfile params={params} />
      </Suspense>
    </main>
  );
}