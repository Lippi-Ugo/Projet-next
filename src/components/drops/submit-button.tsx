"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending: isPending } = useFormStatus();

  return (
    <button type="submit" disabled={isPending} className="min-h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
      {isPending ? "Enregistrement…" : "Enregistrer"}
    </button>
  );
}
