"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/profil/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import type { ProfileValues } from "@/lib/api/types";

const inputClass = "w-full rounded-lg border border-zinc-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-zinc-600 dark:bg-zinc-950";

export function ProfileForm({ profile }: { profile: ProfileValues }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [state, action, pending] = useActionState(updateProfile.bind(null, profile), {});
  const nameError = state.fields?.displayName?.join(" ");
  const bioError = state.fields?.bio?.join(" ");
  const avatarError = state.fields?.avatarUrl?.join(" ");

  return (
    <form action={action} aria-busy={pending} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <fieldset disabled={pending} className="space-y-5">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="profile-name">Nom affiché</FieldLabel>
          <input
            id="profile-name"
            name="displayName"
            required
            maxLength={40}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "profile-name-error" : undefined}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className={inputClass}
          />
          {nameError && <FieldError id="profile-name-error">{nameError}</FieldError>}
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
          <textarea
            id="profile-bio"
            name="bio"
            rows={4}
            maxLength={280}
            aria-invalid={Boolean(bioError)}
            aria-describedby={bioError ? "profile-bio-error" : undefined}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={inputClass}
          />
          {bioError && <FieldError id="profile-bio-error">{bioError}</FieldError>}
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="profile-avatar-url">URL de l’avatar</FieldLabel>
          <input
            id="profile-avatar-url"
            name="avatarUrl"
            type="url"
            maxLength={500}
            placeholder="https://"
            aria-invalid={Boolean(avatarError)}
            aria-describedby={avatarError ? "profile-avatar-help profile-avatar-error" : "profile-avatar-help"}
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className={inputClass}
          />
          <FieldDescription id="profile-avatar-help">
            Colle un lien HTTPS vers une image. Vide ce champ pour retirer la photo.
          </FieldDescription>
          {avatarError && <FieldError id="profile-avatar-error">{avatarError}</FieldError>}
        </Field>
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        {state.saved && <p role="status" className="text-sm text-green-800 dark:text-green-300">Profil enregistré.</p>}
        <Button type="submit" size="lg" disabled={pending} className="min-h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
          {pending ? "Enregistrement…" : "Enregistrer le profil"}
        </Button>
      </fieldset>
    </form>
  );
}
