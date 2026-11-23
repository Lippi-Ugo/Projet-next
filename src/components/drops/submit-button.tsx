"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ pending }: { pending?: boolean }) {
  const status = useFormStatus();
  // L'édition suit son propre envoi avec useActionState.
  const isPending = pending ?? status.pending;

  return (
    <Button type="submit" size="lg" disabled={isPending} className="min-h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
      {isPending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}
