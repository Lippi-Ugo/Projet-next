import Link from "next/link"
import { ProfileAvatar } from "@/components/auth/profile-avatar";
import { apiGet } from "@/lib/api/client";
import { DropPage, Profile } from "@/lib/api/types";
import { requireSession } from "@/lib/session";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
});

export async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const token = await requireSession();

    const user = await apiGet<Profile>(`/users/${encodeURIComponent(username)}`, token,);

    const query = new URLSearchParams({ author: user.username });
    const { items } = await apiGet<DropPage>(`/drops?${query}`, token);

    return (
        <>
            <div className="flex items-center gap-3">
                <ProfileAvatar user={user} />
                <div>
                    <h1 className="text-3xl font-bold">{user.displayName}</h1>
                    <p>@{user.username}</p>
                </div>
            </div>

            <p className="mt-4">{user.bio ?? "Aucune biographie renseignée."}</p>
            <p className="text-sm">
                Membre depuis le{" "}
                <time dateTime={user.createdAt}>
                    {dateFormatter.format(new Date(user.createdAt))}
                </time>
                {" · "}ID {user.id}
            </p>

            <dl className="mt-4 flex flex-wrap gap-6">
                <div>
                    <dt>Drops visibles</dt>
                    <dd>{user.stats.dropsCount}</dd>
                </div>
                <div>
                    <dt>Likes reçus</dt>
                    <dd>{user.stats.likesReceived}</dd>
                </div>
                <div>
                    <dt>Commentaires écrits</dt>
                    <dd>{user.stats.commentsCount}</dd>
                </div>
            </dl>

            <section className="mt-8">
                <h2 className="mb-3 text-xl font-semibold">
                    Drops de {user.displayName}
                </h2>

                {items.length === 0 ? (
                    <p>Aucun drop visible.</p>
                ) : (
                    <ul className="space-y-2">
                        {items.map((drop) => (
                            <li key={drop.id}>
                                <Link href={`/drops/${drop.id}`} className="underline">
                                    {drop.title} · ♥ {drop.likesCount}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}
