import 'server-only'
import { notFound, redirect } from 'next/navigation'

export class ApiError extends Error {
    constructor(readonly status: number, path: string) {
        super(`API ${status} sur ${path}`)
        this.name = 'ApiError'
    }
}

export async function apiGet<T>(path: string, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.status === 401) redirect('/login?expired=1')
    if (res.status === 404) notFound()
    if (!res.ok) throw new ApiError(res.status, path)
    return (await res.json()) as T
}

export async function apiPost<T>(path: string, body?: unknown, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'POST',
        headers: {
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new ApiError(res.status, path)
    return res
}