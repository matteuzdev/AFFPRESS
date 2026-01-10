'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createProject(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const offer_name = formData.get('offer_name') as string
    const geo = formData.get('geo') as string

    const { error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name,
            offer_name,
            geo,
            status: 'draft'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function savePageContent(pageId: string, projectId: string, html_edited: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('pages')
        .update({ html_edited, updated_at: new Date().toISOString() })
        .eq('id', pageId)

    if (error) throw new Error(error.message)

    revalidatePath(`/projects/${projectId}/editor/${pageId}`)
    revalidatePath(`/projects/${projectId}`)
}

export async function savePageConfig(pageId: string, projectId: string, config: { whatsapp_number: string, whatsapp_message: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Salva a configuração como um script especial para contornar limitações de schema na migração
    const scriptName = `WACFG_${pageId}`
    const scriptCode = JSON.stringify(config)

    // Upsert script
    const { data: existing } = await supabase
        .from('scripts')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', scriptName)
        .single()

    if (existing) {
        await supabase
            .from('scripts')
            .update({ script_code: scriptCode, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
    } else {
        await supabase
            .from('scripts')
            .insert({
                user_id: user.id,
                name: scriptName,
                position: 'body-end',
                script_code: scriptCode
            })
    }

    revalidatePath(`/projects/${projectId}/editor/${pageId}`)
}
