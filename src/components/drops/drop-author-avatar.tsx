import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Drop } from "@/lib/api/types";

export function DropAuthorAvatar({ author }: { author: Drop["author"] }) {
  return (
    <Avatar size="lg" aria-hidden="true">
      {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt="" />}
      <AvatarFallback className="bg-blue-100 font-semibold text-blue-900 dark:bg-blue-950 dark:text-blue-100">
        {author.displayName.slice(0, 1).toLocaleUpperCase("fr-FR")}
      </AvatarFallback>
    </Avatar>
  );
}
