'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const TEMPLATES = {
    simple: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{HEADLINE}}</title>
            <style>
                body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #111; font-size: 2.5rem; line-height: 1.2; margin-bottom: 2rem; }
                .btn { display: inline-block; background: #dc2626; color: white; padding: 1rem 2rem; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 1.2rem; }
                .highlight { background: #fef08a; padding: 0 4px; }
            </style>
        </head>
        <body>
            <h1>{{HEADLINE}}</h1>
            <p>{{BODY}}</p>
            <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;" />
            <div style="text-align: center;">
                <a href="#" class="btn">CONTINUAR LENDO &rarr;</a>
            </div>
            <p style="text-align: center; font-size: 0.8rem; color: #888; margin-top: 2rem;">
                Este site não faz parte do site do Facebook ou Facebook Inc. Além disso, este site NÃO é endossado pelo Facebook de forma alguma.
            </p>
        </body>
        </html>
    `,
    story: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>História Incrível</title>
            <style>
                body { font-family: Georgia, serif; line-height: 1.8; color: #222; max-width: 700px; margin: 0 auto; padding: 40px 20px; background: #fffbf0; }
                h1 { font-family: Helvetica, sans-serif; font-size: 2rem; margin-bottom: 1.5rem; }
            </style>
        </head>
        <body>
            <p style="color: #666; font-size: 0.9rem; font-family: sans-serif;">ADVERTORIAL</p>
            <h1>{{HEADLINE}}</h1>
            <p><strong>(São Paulo)</strong> - {{BODY}}</p>
            <a href="#">Clique aqui para ver o vídeo</a>
        </body>
        </html>
    `
}

export async function createPressel(projectId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const headline = formData.get('headline') as string
    const body = formData.get('body') as string
    const templateKey = formData.get('template') as keyof typeof TEMPLATES

    let html = TEMPLATES[templateKey] || TEMPLATES.simple
    html = html.replace(/{{HEADLINE}}/g, headline).replace(/{{BODY}}/g, body)

    const { data: page, error } = await supabase
        .from('pages')
        .insert({
            project_id: projectId,
            type: 'pressel',
            slug: 'pressel-' + Math.random().toString(36).substring(7),
            html_raw: html,
            html_edited: html
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath(`/projects/${projectId}`, 'layout')
    redirect(`/projects/${projectId}/editor/${page.id}`)
}
