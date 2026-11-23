import { redirect } from 'next/navigation'
import { isSessionRejected } from '@/lib/api/client'
import { expireSession, getSession } from '@/lib/session'

export async function GET() {
    const token = await getSession()
    if (!token) redirect('/login?expired=1')

    if (await isSessionRejected(token)) await expireSession()
    redirect('/login')
}
