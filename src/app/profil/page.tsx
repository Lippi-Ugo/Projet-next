import { Suspense } from "react";
import { ProfileAvatar } from "@/components/auth/profile-avatar";
import { ProfileForm } from "@/components/auth/profile-form";
import { apiGet } from "@/lib/api/client";
import type { PrivateUser } from "@/lib/api/types";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Mon profil" };

async function ProfileContent() {
  const token = await requireSession();
  const user = await apiGet<PrivateUser>("/auth/me", token);

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <ProfileAvatar user={user} />
        <div className="min-w-0 wrap-anywhere">
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-sm text-muted-foreground">@{user.username} · {user.email}</p>
        </div>
      </div>
      <ProfileForm profile={{ displayName: user.displayName, bio: user.bio, avatarUrl: user.avatarUrl }} />
    </>
  );
}

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold">Mon profil</h1>
      <Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Chargement du profil…</p>}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}
