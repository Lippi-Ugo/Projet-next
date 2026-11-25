import Link from "next/link"
import { DropAuthorAvatar } from "@/components/drops/drop-author-avatar";
import type { Drop } from "@/lib/api/types";

export function UserProfileLink({ user }: { user: Drop["author"] }) {
    return (
        <Link
            href={`/users/${encodeURIComponent(user.username)}`}
            className="flex items-center gap-3"
        >
            <DropAuthorAvatar author={user} />
            <span className="min-w-0 wrap-anywhere">
                <span className="block font-semibold">{user.displayName}</span>
                <span className="block text-xs text-muted-foreground">
                    @{user.username}
                </span>
            </span>
        </Link>
    );
}
