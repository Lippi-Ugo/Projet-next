import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from '@/components/ui/avatar';
import type { Viewer } from '@/hooks/use-presence';

export function ViewerStack({ users }: { users: Viewer[] }) {
    if (users.length === 0) return null;

    return (
        <div className="flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-sm font-semibold text-foreground dark:border-zinc-700 dark:bg-zinc-900">
            <AvatarGroup aria-hidden="true" className="flex-wrap gap-y-2 space-x-0 ps-2">
                {users.map((user) => (
                    <Avatar key={user.id} size="lg" title={user.displayName} className="-ms-2">
                        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                        <AvatarFallback
                            className="font-semibold text-white"
                            style={{ backgroundColor: `hsl(${(user.id * 137) % 360} 65% 32%)` }}
                        >
                            {user.displayName.slice(0, 1).toLocaleUpperCase('fr-FR')}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </AvatarGroup>
            <p role="status" className="max-w-48">
                {users.length === 1
                    ? '1 personne regarde ce drop'
                    : `${users.length} personnes regardent ce drop`}
            </p>
        </div>
    );
}
