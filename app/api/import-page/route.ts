import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper/engine'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { url, projectId } = await request.json()

        if (!url || !projectId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify project ownership
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Clonagem Inteligente (Novo Engine)
        const { html, title, favicon } = await scrapeUrl(url)

        // Opcional: Atualizar metadados do projeto (favicon/título) se estiverem vazios
        // Por enquanto focamos em criar a página.

        // Create Page
        const { data: page, error } = await supabase
            .from('pages')
            .insert({
                project_id: projectId,
                type: 'cloned',
                source_url: url,
                slug: 'index', // Default slug
                html_raw: html, // HTML Processado
                html_edited: html,
            })
            .select()
            .single()

        if (error) {
            console.error('Db Error:', error)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        return NextResponse.json({ success: true, pageId: page.id })

    } catch (error: any) {
        console.error('Clone error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
