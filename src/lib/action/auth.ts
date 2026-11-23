'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {ApiError, apiPost, rateLimitState} from '@/lib/api/client'
import {clearSession, getSession, setSession} from '@/lib/session'
import type {AuthResponse, RegisterRequest} from '@/lib/api/types'

export type LoginState = {
    error?: string
    retryAt?: number
    invalidCredentials?: boolean
    fields?: Record<string, string[]>
    values?: { login: string }
}

export type RegisterState = {
    error?: string
    retryAt?: number
    fields?: Record<string, string[]>
    values?: Pick<RegisterRequest, 'username' | 'email' | 'displayName'>
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
    if (_prev.retryAt && _prev.retryAt > Date.now()) return _prev
    const loginValue = form.get('login')
    const password = form.get('password')
    if (typeof loginValue !== 'string' || typeof password !== 'string') {
        return { error: 'Saisissez votre identifiant et votre mot de passe.' }
    }

    const values = { login: loginValue }
    let res: Response
    try {
        res = await apiPost('/auth/login', {
            login: loginValue,
            password,
        })
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 401) {
                return {
                    error: 'Identifiant ou mot de passe incorrect.',
                    invalidCredentials: true,
                    values,
                }
            }
            if (error.status === 403) {
                return { error: 'La connexion a été refusée.', values }
            }
            if (error.status === 429) {
                return { ...rateLimitState(error), values }
            }
            if (error.status === 409 || error.status === 422) {
                return {
                    error: error.apiMessage ?? 'Vérifiez les informations saisies.',
                    fields: error.fields,
                    values,
                }
            }
            if (error.status >= 500) {
                return { error: 'Le service de connexion est indisponible. Réessayez plus tard.', values }
            }
            return {
                error: error.apiMessage ?? 'La connexion a échoué. Vérifiez les informations saisies et réessayez.',
                values,
            }
        }
        if (error instanceof TypeError) {
            return {
                error: 'Impossible de contacter le service de connexion. Vérifiez votre connexion et réessayez.',
                values,
            }
        }
        throw error
    }

    const {token, expiresAt} = (await res.json()) as AuthResponse
    await setSession(token, expiresAt)
    revalidatePath('/drops')
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function register(_prev: RegisterState, form: FormData): Promise<RegisterState> {
    if (_prev.retryAt && _prev.retryAt > Date.now()) return _prev
    const username = form.get('username')
    const email = form.get('email')
    const password = form.get('password')
    const displayName = form.get('displayName')

    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof displayName !== 'string'
    ) {
        return { error: 'Vérifiez les champs du formulaire et réessayez.' }
    }

    const values = {
        username: username.trim(),
        email: email.trim(),
        displayName: displayName.trim(),
    }
    const body: RegisterRequest = {
        ...values,
        password,
    }

    let res: Response
    try {
        res = await apiPost('/auth/register', body)
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 409 || error.status === 422) {
                return {
                    error: error.apiMessage ?? 'Vérifiez les informations saisies.',
                    fields: error.fields,
                    values,
                }
            }
            if (error.status === 403) {
                return { error: 'La création du compte a été refusée.', values }
            }
            if (error.status === 429) {
                return { ...rateLimitState(error), values }
            }
            if (error.status >= 500) {
                return { error: 'Le service d’inscription est indisponible. Réessayez plus tard.', values }
            }
            return {
                error: error.apiMessage ?? 'La création du compte a échoué. Vérifiez les informations saisies.',
                values,
            }
        }
        if (error instanceof TypeError) {
            return {
                error: 'Impossible de contacter le service d’inscription. Vérifiez votre connexion et réessayez.',
                values,
            }
        }
        throw error
    }

    const {token, expiresAt} = (await res.json()) as AuthResponse
    await setSession(token, expiresAt)
    revalidatePath('/drops')
    revalidatePath('/', 'layout')
    redirect('/drops')
}

export async function logout() {
    const token = await getSession()
    if (token) {
        try {
            await apiPost('/auth/logout', undefined, token)
        } catch (error) {
            if (!(error instanceof ApiError && error.status === 401)) {
                throw error
            }
        }
    }

    await clearSession()
    redirect('/login')
}
