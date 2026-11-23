import 'server-only'

export function readDropForm(form: FormData) {
    const text = (name: string) => String(form.get(name) ?? '').trim()

    return {
        title: text('title'),
        content: text('content'),
        category: text('category'),
        imageUrl: text('imageUrl') || null,
        lat: Number(text('lat') || NaN),
        lng: Number(text('lng') || NaN),
    }
}
