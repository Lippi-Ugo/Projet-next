'use client'

import { useActionState } from 'react'
import { register, type RegisterState } from '@/lib/action/auth'

const initialState: RegisterState = {}
const inputClassName = "min-h-12 rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-600 hover:border-zinc-500 focus-visible:border-blue-800 focus-visible:ring-4 focus-visible:ring-blue-800/15 aria-invalid:border-red-700 aria-invalid:focus-visible:border-red-700 aria-invalid:focus-visible:ring-red-700/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-400 dark:aria-invalid:border-red-400"

export function RegisterForm() {
    const [state, action, pending] = useActionState(register, initialState)
    const usernameErrors = state.fields?.username ?? []
    const emailErrors = state.fields?.email ?? []
    const displayNameErrors = state.fields?.displayName ?? []
    const passwordErrors = state.fields?.password ?? []

    return (
        <form action={action} aria-busy={pending} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Identifiant
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-z0-9_]{3,20}"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="ex. lea_mmi"
                    defaultValue={state.values?.username ?? ""}
                    aria-invalid={usernameErrors.length ? "true" : undefined}
                    aria-describedby={usernameErrors.length ? "username-error" : undefined}
                    className={inputClassName}
                />
                {usernameErrors.length > 0 && (
                    <p id="username-error" className="text-sm text-red-800 dark:text-red-200">
                        {usernameErrors.join(" ")}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="displayName" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Nom affiché
                </label>
                <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    minLength={1}
                    maxLength={40}
                    autoComplete="name"
                    placeholder="Votre nom"
                    defaultValue={state.values?.displayName ?? ""}
                    aria-invalid={displayNameErrors.length ? "true" : undefined}
                    aria-describedby={displayNameErrors.length ? "display-name-error" : undefined}
                    className={inputClassName}
                />
                {displayNameErrors.length > 0 && (
                    <p id="display-name-error" className="text-sm text-red-800 dark:text-red-200">
                        {displayNameErrors.join(" ")}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Adresse électronique
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.fr"
                    defaultValue={state.values?.email ?? ""}
                    aria-invalid={emailErrors.length ? "true" : undefined}
                    aria-describedby={emailErrors.length ? "email-error" : undefined}
                    className={inputClassName}
                />
                {emailErrors.length > 0 && (
                    <p id="email-error" className="text-sm text-red-800 dark:text-red-200">
                        {emailErrors.join(" ")}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Mot de passe
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    placeholder="Au moins 8 caractères"
                    aria-invalid={passwordErrors.length ? "true" : undefined}
                    aria-describedby={passwordErrors.length ? "password-error" : undefined}
                    className={inputClassName}
                />
                {passwordErrors.length > 0 && (
                    <p id="password-error" className="text-sm text-red-800 dark:text-red-200">
                        {passwordErrors.join(" ")}
                    </p>
                )}
            </div>
            {state.error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    {state.error}
                </p>
            )}
            <button
                disabled={pending}
                type="submit"
                aria-live="polite"
                className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Création du compte…" : "Créer mon compte"}
            </button>
        </form>
    )
}
