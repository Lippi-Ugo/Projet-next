'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiPost } from '@/lib/api/client'
import type { Drop } from '@/lib/api/types'
import { requireSession } from '@/lib/session'
import { readDropForm } from '../drop-form-data'

export async function createDrop(form: FormData) {
    const token = await requireSession()
    const response = await apiPost('/drops', readDropForm(form), token)
    const drop: Drop = await response.json()

    revalidatePath('/drops')
    redirect(`/drops/${drop.id}`)
}
