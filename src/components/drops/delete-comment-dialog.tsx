"use client";

import { useFormStatus } from "react-dom";
import { deleteComment } from "@/app/drops/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteCommentDialog({ commentId }: { commentId: number }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive" />}>
        Supprimer le commentaire
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce commentaire ?</AlertDialogTitle>
          <AlertDialogDescription>La suppression est définitive.</AlertDialogDescription>
        </AlertDialogHeader>
        <form action={deleteComment.bind(null, commentId)}>
          <DeleteCommentButtons />
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteCommentButtons() {
  const { pending } = useFormStatus();

  return (
    <AlertDialogFooter>
      <AlertDialogCancel type="button" disabled={pending}>Annuler</AlertDialogCancel>
      <AlertDialogAction type="submit" variant="destructive" disabled={pending}>
        {pending ? "Suppression…" : "Supprimer"}
      </AlertDialogAction>
    </AlertDialogFooter>
  );
}
