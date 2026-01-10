
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const download = searchParams.get('download') === 'true'

    if (!pageId) {
        return NextResponse.json({ error: 'Missing pageId' }, { status: 400 })
    }

    // 1. Fetch Page
    const { data: page } = await supabase
        .from('pages')
        .select('*, projects(*)')
        .eq('id', pageId)
        .single()

    if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // 2. Fetch Scripts (Global)
    // For MVP we might apply ALL scripts of the user, or strictly the ones linked.
    // We'll apply ALL global scripts for now or just linked ones if relation exists.
    // Let's assume we want to inject all active scripts for this user for simplicity/completeness,
    // or strictly following the relation table. Following PRD Phase 5: "Tela por página: escolher quais scripts globais aplicar".
    // Since we haven't built the UI to link scripts to pages yet (skipped in MVP UI), 
    // let's inject ALL user scripts for now as a "Global" default behavior, as it's more useful for a simple affiliate setup.

    const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', page.projects.user_id)

    let finalHtml = page.html_edited || page.html_raw || ''

    // 2.5 Security Cleanup: Garantir que scripts do editor não vazem
    finalHtml = finalHtml.replace(/<script src="\/editor-client\.js"><\/script>/g, '')

    // 3. Inject Scripts & WhatsApp
    let headInjects = []
    let bodyInjects = []

    if (scripts && scripts.length > 0) {
        // Scripts Globais (exceto os de configuração interna)
        const globalScripts = scripts.filter(s => !s.name.startsWith('WACFG_'))
        headInjects.push(...globalScripts.filter(s => s.position === 'head').map(s => s.script_code))
        bodyInjects.push(...globalScripts.filter(s => s.position === 'body-end').map(s => s.script_code))

        // WhatsApp Config
        const waScript = scripts.find(s => s.name === `WACFG_${pageId}`)
        if (waScript) {
            try {
                const config = JSON.parse(waScript.script_code)
                if (config.whatsapp_number) {
                    bodyInjects.push(`
<script>
    window.AFFPRESS_WHATSAPP_CONFIG = {
        number: "${config.whatsapp_number.replace(/\D/g, '')}",
        message: "${config.whatsapp_message || 'Olá!'}"
    };
</script>
<script src="https://cdn.jsdelivr.net/gh/hiantoni/affpress/public/whatsapp-widget.js"></script>
                    `)
                }
            } catch (e) { console.error('WA Config error', e) }
        }
    }

    // Injetar rastreador de métricas nativo do AFFPRESS
    bodyInjects.push(`<script src="/tracker.js" data-page-id="${pageId}"></script>`)

    if (headInjects.length > 0) {
        const join = headInjects.join('\n')
        finalHtml = finalHtml.replace(/<\/head>/i, `\n${join}\n</head>`)
    }
    if (bodyInjects.length > 0) {
        const join = bodyInjects.join('\n')
        finalHtml = finalHtml.replace(/<\/body>/i, `\n${join}\n</body>`)
    }

    // 4. Return
    const headers = new Headers()
    headers.set('Content-Type', 'text/html; charset=utf-8')
    if (download) {
        headers.set('Content-Disposition', `attachment; filename="${page.slug || 'page'}.html"`)
    }

    return new NextResponse(finalHtml, { headers })
}
