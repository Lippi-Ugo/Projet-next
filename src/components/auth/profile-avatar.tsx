import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PrivateUser } from "@/lib/api/types";

export function ProfileAvatar({ user }: { user: Pick<PrivateUser, "displayName" | "avatarUrl"> | null }) {
  return (
    <Avatar size="lg" aria-hidden="true">
      {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
      <AvatarFallback className="bg-blue-100 font-semibold text-blue-900 dark:bg-blue-950 dark:text-blue-100">
        {user ? user.displayName.slice(0, 1).toLocaleUpperCase("fr-FR") : <UserRound className="size-5" />}
      </AvatarFallback>
    </Avatar>
  );
}
