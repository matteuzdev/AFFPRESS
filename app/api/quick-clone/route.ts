import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper/engine'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    try {
        const { url, sourceCode, pageName, affiliateLink, presellType, pixelCode, geo } = await request.json()

        // Validação: precisa de URL ou sourceCode
        if (!url && !sourceCode) {
            return NextResponse.json({ error: 'URL ou código fonte é obrigatório' }, { status: 400 })
        }

        let html: string
        let finalUrl: string
        let title: string
        let projectName: string

        if (sourceCode) {
            html = sourceCode
            finalUrl = ''
            const $ = cheerio.load(sourceCode)
            title = $('title').text().trim() || pageName || 'Página Clonada'
            projectName = pageName || title
        } else {
            const urlObj = new URL(url)
            const result = await scrapeUrl(url)
            html = result.html
            finalUrl = result.finalUrl
            title = result.title
            projectName = `Clone - ${urlObj.hostname}`
        }

        // --- AUTOMAÇÃO INTELIGENTE ---

        const $ = cheerio.load(html)

        // 1. Substituição Massiva de Links (conforme pedido: "altere em todos os lugares possíveis de clique")
        if (affiliateLink) {
            $('a').attr('href', affiliateLink)
            // Também lidar com window.location.href em botões se houver padrões comuns, mas por agora <a> é o núcleo.
            html = $.html()
        }

        // --- TRADUÇÕES E LOCALIZAÇÃO ---
        const translations: any = {
            BR: {
                cookieTitle: 'Uso de Cookies',
                cookieText: 'Este site usa cookies para personalizar conteúdos e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Ao clicar em Aceitar, você concorda com o uso de cookies. Para mais informações, acesse nossa <a href="#" style="color: #007bff; text-decoration: underline;">Política de Cookies</a>.',
                cookieAccept: 'Aceitar',
                cookieClose: 'Fechar',
                quizTitle: 'Avaliação Rápida de Saúde',
                quizText: 'Responda 3 perguntas rápidas para ver se esta solução é ideal para você.',
                quizQ1: '1. Você tem mais de 30 anos?',
                quizQ2: '2. Já tentou outros suplementos antes?',
                quizYes: 'Sim',
                quizNo: 'Não',
                quizResult: '🎉 Parabéns! Você se qualifica.',
                quizButton: 'Ver Meus Resultados',
                advTitle: 'Notícias de Hoje',
                advSponsored: 'Conteúdo Patrocinado'
            },
            US: {
                cookieTitle: 'Cookie Policy',
                cookieText: 'This site uses cookies to personalize content and ads, provide social media features, and analyze our traffic. By clicking Accept, you agree to the use of cookies. For more information, please visit our <a href="#" style="color: #007bff; text-decoration: underline;">Cookie Policy</a>.',
                cookieAccept: 'Accept',
                cookieClose: 'Close',
                quizTitle: 'Quick Health Assessment',
                quizText: 'Answer 3 quick questions to see if this solution is right for you.',
                quizQ1: '1. Are you over 30 years old?',
                quizQ2: '2. Have you tried other supplements before?',
                quizYes: 'Yes',
                quizNo: 'No',
                quizResult: '🎉 Congratulations! You qualify.',
                quizButton: 'Show My Results',
                advTitle: 'Health News Today',
                advSponsored: 'Sponsored Content'
            }
        }

        // Fallback para inglês se o GEO não estiver mapeado (UK, CA, EU)
        const t = translations[geo] || translations.US

        // 2. Aplicação de Template de Presell (Funis Nutra USA / Localizados)
        if (presellType && presellType !== 'direct') {
            if (presellType === 'advertorial') {
                $('body').prepend(`
                    <div style="background: white; border-bottom: 3px solid #cc0000; padding: 15px; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold; color: #cc0000; text-transform: uppercase; font-size: 14px;">${t.advTitle}</span>
                            <span style="font-size: 12px; color: #666;">${t.advSponsored}</span>
                        </div>
                    </div>
                `)
            } else if (presellType === 'quiz') {
                // Injetar um simples script de Quiz que bloqueia a página até responder
                $('body').prepend(`
                    <div id="affpress-quiz-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: sans-serif; color: white; padding: 20px;">
                        <div style="max-width: 500px; background: #1a1a2e; padding: 40px; border-radius: 20px; border: 1px solid #333; text-align: center;">
                            <h2 style="font-size: 24px; margin-bottom: 20px;">${t.quizTitle}</h2>
                            <p style="color: #ccc; margin-bottom: 30px;">${t.quizText}</p>
                            <div id="quiz-step-1">
                                <p style="font-weight: bold; margin-bottom: 20px;">${t.quizQ1}</p>
                                <button onclick="document.getElementById('quiz-step-1').style.display='none'; document.getElementById('quiz-step-2').style.display='block';" style="background: #4f46e5; color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; margin: 5px;">${t.quizYes}</button>
                                <button onclick="document.getElementById('quiz-step-1').style.display='none'; document.getElementById('quiz-step-2').style.display='block';" style="background: #333; color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; margin: 5px;">${t.quizNo}</button>
                            </div>
                            <div id="quiz-step-2" style="display: none;">
                                <p style="font-weight: bold; margin-bottom: 20px;">${t.quizQ2}</p>
                                <button onclick="document.getElementById('quiz-step-2').style.display='none'; document.getElementById('quiz-step-result').style.display='block';" style="background: #4f46e5; color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; margin: 5px;">${t.quizYes}</button>
                                <button onclick="document.getElementById('quiz-step-2').style.display='none'; document.getElementById('quiz-step-result').style.display='block';" style="background: #333; color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; margin: 5px;">${t.quizNo}</button>
                            </div>
                            <div id="quiz-step-result" style="display: none;">
                                <p style="font-weight: bold; color: #4ade80; margin-bottom: 20px;">${t.quizResult}</p>
                                <button onclick="document.getElementById('affpress-quiz-overlay').style.display='none';" style="background: #4ade80; color: black; border: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; cursor: pointer;">${t.quizButton}</button>
                            </div>
                        </div>
                    </div>
                `)
            } else if (presellType === 'cookie') {
                // Injetar o modelo de Cookie Consent com design "SynaDentix" Style
                // Qualquer clique no overlay ou no modal redireciona para o affiliateLink
                $('body').prepend(`
                    <div id="affpress-cookie-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99999999; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; cursor: pointer; padding: 20px; animation: affpressFadeIn 0.3s ease-out;" onclick="window.location.href='${affiliateLink || '#'}'">
                        <div style="width: 100%; max-width: 440px; background: white; padding: 45px 35px; border-radius: 12px; text-align: center; box-shadow: 0 30px 100px rgba(0,0,0,0.6); color: #000; cursor: default; position: relative; animation: affpressPop 0.5s cubic-bezier(0.19, 1, 0.22, 1);">
                            <p style="font-size: 19px; color: #111; margin-bottom: 35px; line-height: 1.5; font-weight: 500; letter-spacing: -0.01em;">${t.cookieText}</p>
                            <div style="display: flex; gap: 12px; justify-content: center;">
                                <button style="flex: 1; background: #007bff; color: white; border: none; padding: 14px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,123,255,0.3);"> ${t.cookieAccept}</button>
                                <button style="flex: 1; background: #007bff; color: white; border: none; padding: 14px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,123,255,0.3);">${t.cookieClose}</button>
                            </div>
                        </div>
                    </div>
                    <style>
                        html, body { overflow: hidden !important; height: 100% !important; position: fixed !important; width: 100% !important; }
                        #affpress-cookie-overlay * { box-sizing: border-box; }
                        @keyframes affpressFadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes affpressPop { from { opacity: 0; transform: scale(0.85) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                    </style>
                    <script>
                        // Pequeno scroll para dar contexto da página ao fundo sem descer demais
                        setTimeout(() => { if(window.scrollY < 60) window.scrollTo({ top: 60, behavior: 'smooth' }); }, 150);
                    </script>
                `)
            }
            html = $.html()
        }

        // 1. Cria projeto automaticamente com GEO correto
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name: projectName.substring(0, 100),
                offer_name: title.substring(0, 100),
                geo: geo || 'US',
                status: 'ready'
            })
            .select()
            .single()

        if (projectError || !project) {
            throw new Error('Falha ao criar projeto: ' + projectError?.message)
        }

        // 2. Gera slug
        const slug = sourceCode
            ? (pageName || 'pagina').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 50) || 'home'
            : new URL(url).pathname.replace(/\//g, '-').replace(/^-|-$/g, '').substring(0, 50) || 'home'

        // 3. Salva a página
        const { data: page, error: pageError } = await supabase
            .from('pages')
            .insert({
                project_id: project.id,
                slug,
                source_url: finalUrl || url || '',
                html_raw: html,
                html_edited: html,
                type: 'cloned'
            })
            .select()
            .single()

        if (pageError || !page) {
            await supabase.from('projects').delete().eq('id', project.id)
            throw new Error('Falha ao salvar página: ' + pageError?.message)
        }

        // 4. Cria e Vincula Pixel/Script se fornecido
        if (pixelCode) {
            const { data: script } = await supabase
                .from('scripts')
                .insert({
                    user_id: user.id,
                    name: `Pixel - ${projectName}`,
                    position: 'head',
                    script_code: pixelCode
                })
                .select()
                .single()

            if (script) {
                await supabase.from('page_scripts').insert({
                    page_id: page.id,
                    script_id: script.id
                })
            }
        }

        return NextResponse.json({
            projectId: project.id,
            pageId: page.id,
            title
        })

    } catch (error: any) {
        console.error('[quick-clone] Error:', error)
        return NextResponse.json(
            { error: error.message || 'Erro interno ao clonar' },
            { status: 500 }
        )
    }
}
