"use client";

import { startTransition, useActionState, type ReactNode } from "react";
import { SubmitButton } from "./submit-button";

export function EditDropForm({ action, children }: {
  action: (form: FormData) => Promise<string>;
  children: ReactNode;
}) {
  const [error, submit, pending] = useActionState(
    (_previous: string, form: FormData) => action(form),
    "",
  );

  return (
    <form
      action={submit}
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        const form = new FormData(event.currentTarget);
        startTransition(() => submit(form));
      }}
      aria-busy={pending}
      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <fieldset disabled={pending} className="space-y-4">
        {children}
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
        <SubmitButton pending={pending} />
      </fieldset>
    </form>
  );
}
