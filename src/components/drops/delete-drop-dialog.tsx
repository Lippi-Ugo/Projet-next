"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
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
import { deleteDrop } from "@/app/drops/actions";

export function DeleteDropDialog({ dropId }: { dropId: number }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" className="text-destructive" />}>
        Supprimer le drop
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce drop ?</AlertDialogTitle>
          <AlertDialogDescription>La suppression est définitive.</AlertDialogDescription>
        </AlertDialogHeader>
        <form action={deleteDrop.bind(null, dropId)}>
          <DeleteDropButtons />
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteDropButtons() {
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
