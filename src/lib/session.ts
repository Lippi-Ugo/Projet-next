import 'server-only'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function setSession(token: string, expiresAt: string) {
    const expires = new Date(expiresAt)
    if (!token || !Number.isFinite(expires.getTime()) || expires <= new Date()) {
        throw new Error('La session reçue de l’API est invalide ou expirée.')
    }

    (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires,
        path: '/',
    })
}

export async function getSession() {
    return (await cookies()).get('session')?.value
}

export async function clearSession() {
    (await cookies()).delete('session')
}

export async function expireSession() {
    await clearSession()
    redirect('/login?expired=1')
}

export async function requireSession() {
    const token = (await cookies()).get('session')?.value
    if (!token) redirect('/login')
    return token
}

export async function getToken() {
    return (await cookies()).get('session')?.value
}