import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '@/components/ui/avatar';
import type { Viewer } from '@/hooks/use-presence';

export function ViewerStack({ users }: { users: Viewer[] }) {
    if (users.length === 0) return null;

    const visibleUsers = users.slice(0, 4);
    const remainingCount = users.length - visibleUsers.length;

    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <AvatarGroup aria-hidden="true">
                {visibleUsers.map((user) => (
                    <Avatar key={user.id} title={user.displayName}>
                        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                        <AvatarFallback>
                            {user.displayName.slice(0, 1).toLocaleUpperCase('fr-FR')}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {remainingCount > 0 && <AvatarGroupCount>+{remainingCount}</AvatarGroupCount>}
            </AvatarGroup>
            <p role="status">
                {users.length === 1
                    ? '1 personne regarde ce drop'
                    : `${users.length} personnes regardent ce drop`}
            </p>
        </div>
    );
}
