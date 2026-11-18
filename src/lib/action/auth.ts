'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {ApiError, apiPost} from '@/lib/api/client'
import {clearSession, getSession, setSession} from '@/lib/session'
import type {AuthResponse} from '@/lib/api/types'

export type LoginState = {
    error?: string
    invalidCredentials?: boolean
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
    let res: Response
    try {
        res = await apiPost('/auth/login', {
            login: form.get('login'),
            password: form.get('password'),
        })
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 401) {
                return {
                    error: 'Identifiant ou mot de passe incorrect.',
                    invalidCredentials: true,
                }
            }
            if (error.status === 429) {
                return { error: 'Trop de tentatives. Veuillez patienter avant de réessayer.' }
            }
            if (error.status >= 500) {
                return { error: 'Le service de connexion est indisponible. Réessayez plus tard.' }
            }
            return { error: 'La connexion a échoué. Vérifiez les informations saisies et réessayez.' }
        }
        if (error instanceof TypeError) {
            return { error: 'Impossible de contacter le service de connexion. Vérifiez votre connexion et réessayez.' }
        }
        throw error
    }

    const {token, expiresAt} = (await res.json()) as AuthResponse
    await setSession(token, expiresAt)
    revalidatePath('/drops')
    revalidatePath('/', 'layout')
    redirect('/')
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
    redirect('/')
}