import 'server-only'
import { notFound } from 'next/navigation'

export async function apiGet<T>(path: string, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.status === 404) notFound()
    // 401 : on y revient cet après-midi
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return (await res.json()) as T
}

export async function apiPost<T>(path: string, body: unknown, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    })
    if (res.status === 404) notFound()
    // 401 : on y revient cet après-midi
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return res
}