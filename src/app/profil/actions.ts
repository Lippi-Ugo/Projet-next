"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiPatch } from "@/lib/api/client";
import type { ApiErrorResponse, ProfileUpdate, ProfileValues } from "@/lib/api/types";
import { requireSession } from "@/lib/session";

export type ProfileState = {
  error?: string;
  fields?: ApiErrorResponse["error"]["fields"];
  saved?: boolean;
};

export async function updateProfile(profile: ProfileValues, _previous: ProfileState, form: FormData): Promise<ProfileState> {
  const token = await requireSession();
  const displayName = String(form.get("displayName") ?? "").trim();
  const bio = String(form.get("bio") ?? "").trim() || null;
  const avatarUrl = String(form.get("avatarUrl") ?? "").trim() || null;

  if (!displayName || displayName.length > 40) {
    return { fields: { displayName: ["Saisis un nom affiché de 1 à 40 caractères."] } };
  }
  if (bio && bio.length > 280) {
    return { fields: { bio: ["La bio doit contenir au maximum 280 caractères."] } };
  }
  if (avatarUrl && (avatarUrl.length > 500 || !URL.canParse(avatarUrl) || new URL(avatarUrl).protocol !== "https:")) {
    return { fields: { avatarUrl: ["Saisis une URL HTTPS valide pour l’avatar."] } };
  }

  const changes: ProfileUpdate = {};
  if (displayName !== profile.displayName) changes.displayName = displayName;
  if (bio !== profile.bio) changes.bio = bio;
  if (avatarUrl !== profile.avatarUrl) changes.avatarUrl = avatarUrl;
  if (Object.keys(changes).length === 0) return { saved: true };

  try {
    await apiPatch("/auth/me", changes, token);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422 && Object.keys(error.fields).length > 0) return { fields: error.fields };
      return { error: error.apiMessage ?? "Impossible d’enregistrer le profil." };
    }
    if (error instanceof TypeError) {
      return { error: "Le service est momentanément indisponible. Réessaie dans un instant." };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return { saved: true };
}
