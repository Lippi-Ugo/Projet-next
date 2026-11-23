'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect, RedirectType } from 'next/navigation'
import { ApiError, apiPatch } from '@/lib/api/client'
import type { Drop } from '@/lib/api/types'
import { requireSession } from '@/lib/session'
import { readDropForm } from './drop-form-data'

export async function updateDrop(drop: Drop, form: FormData) {
    const token = await requireSession()
    if (!Number.isSafeInteger(drop.id) || drop.id < 1) notFound()

    const path = `/drops/${drop.id}`
    const { title, content, category, imageUrl, lat, lng } = readDropForm(form)
    const changes = {
        ...(title !== drop.title && { title }),
        ...(content !== (drop.content ?? '') && { content }),
        ...(category !== drop.category && { category }),
        ...(imageUrl !== drop.imageUrl && { imageUrl }),
        ...((lat !== drop.location.lat || lng !== drop.location.lng) && { lat, lng }),
    }

    if (Object.keys(changes).length) {
        try {
            await apiPatch(path, changes, token)
        } catch (error) {
            if (error instanceof ApiError && error.status === 422) {
                return Object.values(error.fields).flat().join(' ') || 'Vérifiez les champs du formulaire.'
            }
            throw error
        }
        revalidatePath('/drops')
        revalidatePath(path)
        revalidatePath(`${path}/edit`)
    }
    redirect(path, RedirectType.replace)
}
