'use client';
import { usePresence } from '@/hooks/use-presence';
import { ViewerStack } from './ViewerStack';

export function PresenceWidget(
    { dropId }: { dropId: number }) {
    const viewers = usePresence(dropId);
    return <ViewerStack users={viewers} />;
}
