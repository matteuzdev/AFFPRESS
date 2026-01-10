'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replaceLinks(pageId: string, projectId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const original_url = formData.get('original_url') as string
    const new_url = formData.get('new_url') as string

    // 1. Create record
    const { error } = await supabase
        .from('links')
        .insert({
            page_id: pageId,
            original_url,
            new_url,
            is_affiliate: true
        })

    if (error) throw new Error(error.message)

    // 2. Perform replacement in HTML
    const { data: page } = await supabase
        .from('pages')
        .select('html_edited')
        .eq('id', pageId)
        .single()

    if (page?.html_edited) {
        // Simple string replace for MVP (Global)
        // In reality, valid HTML parsing is safer (cheerio/jsdom)
        const updatedHtml = page.html_edited.split(original_url).join(new_url)

        await supabase
            .from('pages')
            .update({ html_edited: updatedHtml, updated_at: new Date().toISOString() })
            .eq('id', pageId)
    }

    revalidatePath(`/projects/${projectId}/editor/${pageId}`)
}
