import 'server-only'
import { notFound, redirect } from 'next/navigation'
import { expireSession } from '@/lib/session'
import type { ApiErrorResponse } from '@/lib/api/types'

export class ApiError extends Error {
    readonly fields: ApiErrorResponse['error']['fields']

    constructor(
        readonly status: number,
        path: string,
        readonly apiMessage?: string,
        fields: ApiErrorResponse['error']['fields'] = {},
        readonly retryAfter: string | null = null,
    ) {
        super(`API ${status} sur ${path}${apiMessage ? ` : ${apiMessage}` : ''}`)
        this.name = 'ApiError'
        this.fields = fields
    }
}

export type RateLimitState = { retryAt?: number }

export function rateLimitState(error: ApiError): RateLimitState & { error: string } {
    const header = error.retryAfter?.trim()
    const now = Date.now()
    const retryAt = header && /^\d+$/.test(header)
        ? now + Number(header) * 1000
        : Date.parse(header ?? '')
    if (!Number.isFinite(retryAt) || retryAt <= now) {
        return { error: 'Trop de requêtes. Veuillez patienter avant de réessayer.' }
    }
    const seconds = Math.ceil((retryAt - now) / 1000)
    return { error: `Trop de requêtes. Réessayez dans ${seconds} s.`, retryAt }
}

function isErrorFields(value: unknown): value is ApiErrorResponse['error']['fields'] {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false
    }

    return Object.values(value).every(
        (messages) =>
            Array.isArray(messages) &&
            messages.every((message) => typeof message === 'string'),
    )
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    if (typeof value !== 'object' || value === null || !('error' in value)) {
        return false
    }

    const error = value.error
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string' &&
        'fields' in error &&
        isErrorFields(error.fields)
    )
}

async function throwApiError(response: Response, path: string): Promise<never> {
    let payload: unknown
    try {
        payload = await response.clone().json()
    } catch (error) {
        if (!(error instanceof SyntaxError)) throw error
    }

    const details = isApiErrorResponse(payload) ? payload.error : undefined
    throw new ApiError(response.status, path, details?.message, details?.fields, response.headers.get('Retry-After'))
}

function getResponse(path: string, token?: string) {
    return fetch(`${process.env.API_URL}${path}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}

export async function isSessionRejected(token: string) {
    const response = await getResponse('/auth/me', token)
    return response.status === 401
}

export async function apiGet<T>(path: string, token?: string) {
    const res = await getResponse(path, token)
    if (res.status === 401) redirect(token ? '/login/session-expired' : '/login')
    if (res.status === 404) notFound()
    if (!res.ok) await throwApiError(res, path)
    return (await res.json()) as T
}

export async function apiPost(path: string, body?: unknown, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'POST',
        headers: {
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    if (res.status === 401 && token && path !== '/auth/logout') await expireSession()
    if (res.status === 404) notFound()
    if (!res.ok) await throwApiError(res, path)
    return res
}

export async function apiDelete(path: string, token: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) await expireSession()
    if (res.status === 404) notFound()
    if (!res.ok) await throwApiError(res, path)
}
