'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/lib/action/auth'

const initialState: LoginState = {}
const inputClassName = "min-h-12 rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-600 hover:border-zinc-500 focus-visible:border-blue-800 focus-visible:ring-4 focus-visible:ring-blue-800/15 aria-invalid:border-red-700 aria-invalid:focus-visible:border-red-700 aria-invalid:focus-visible:ring-red-700/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-400 dark:aria-invalid:border-red-400"

export function LoginForm() {
    const [state, action, pending] = useActionState(login, initialState)
    const loginErrors = state.fields?.login ?? []
    const passwordErrors = state.fields?.password ?? []

    return (
        <form action={action} aria-busy={pending} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="login" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Identifiant ou adresse email
                </label>
                <input
                    id="login"
                    name="login"
                    required
                    type="text"
                    autoComplete="username"
                    placeholder="Identifiant"
                    defaultValue={state.values?.login ?? ""}
                    aria-invalid={state.invalidCredentials || loginErrors.length ? "true" : undefined}
                    aria-describedby={loginErrors.length ? "login-field-error" : undefined}
                    className={inputClassName}
                />
                {loginErrors.length > 0 && (
                    <p id="login-field-error" className="text-sm text-red-800 dark:text-red-200">
                        {loginErrors.join(" ")}
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
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    aria-invalid={state.invalidCredentials || passwordErrors.length ? "true" : undefined}
                    aria-describedby={passwordErrors.length ? "password-field-error" : undefined}
                    className={inputClassName}
                />
                {passwordErrors.length > 0 && (
                    <p id="password-field-error" className="text-sm text-red-800 dark:text-red-200">
                        {passwordErrors.join(" ")}
                    </p>
                )}
            </div>
            {state?.error && (
                <p id="login-error" role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
                    {state.error}
                </p>
            )}
            <button
                disabled={pending}
                type="submit"
                aria-live="polite"
                className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Connexion en cours…" : "Se connecter"}
            </button>
        </form>
    )
}