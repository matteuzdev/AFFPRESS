import * as cheerio from 'cheerio'

// Lista estática de User-Agents para rotação (compatível com Turbopack)
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]

function getRandomUserAgent(): string {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

interface ScrapeResult {
    html: string
    title: string
    metaDescription: string
    favicon: string | null
    finalUrl: string
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
    try {
        // Rotacionar User-Agent para evitar bloqueios simples
        const headers = {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }

        const response = await fetch(url, { headers })

        if (!response.ok) {
            throw new Error(`Falha ao buscar URL: ${response.status} ${response.statusText}`)
        }

        const rawHtml = await response.text()
        const $ = cheerio.load(rawHtml)

        // 1. Reescrever URLs Relativas para Absolutas (Critical Fix)
        const baseUrl = new URL(url)

        // Tags com 'src' (img, script, iframe, audio, video, source)
        $('[src]').each((_, el) => {
            const src = $(el).attr('src')
            if (src) {
                try {
                    // Se for relativo, transforma em absoluto usando a base URL
                    const absoluteSrc = new URL(src, baseUrl.href).href
                    $(el).attr('src', absoluteSrc)
                } catch (e) {
                    console.warn('Falha ao resolver URL:', src)
                }
            }
        })

        // Tags com 'href' (link, a, area, base)
        $('[href]').each((_, el) => {
            const href = $(el).attr('href')
            if (href) {
                try {
                    const absoluteHref = new URL(href, baseUrl.href).href
                    $(el).attr('href', absoluteHref)
                } catch (e) {
                    console.warn('Falha ao resolver href:', href)
                }
            }
        })

        // Tags com 'srcset' (imagens responsivas)
        $('[srcset]').each((_, el) => {
            const srcset = $(el).attr('srcset')
            if (srcset) {
                const newSrcset = srcset.split(',').map(part => {
                    const [urlPart, descriptor] = part.trim().split(/\s+/)
                    try {
                        const absoluteUrl = new URL(urlPart, baseUrl.href).href
                        return descriptor ? `${absoluteUrl} ${descriptor}` : absoluteUrl
                    } catch {
                        return part
                    }
                }).join(', ')
                $(el).attr('srcset', newSrcset)
            }
        })

        // 2. Remover Scripts de Rastreamento (Pixel Cleaning)
        // Isso evita que o pixel do produtor original dispare na nossa página clonada
        $('script').each((_, el) => {
            const content = $(el).html() || ''
            const src = $(el).attr('src') || ''

            // Lista negra básica de rastreadores
            if (
                content.includes('fbq(') ||
                content.includes('gtag(') ||
                content.includes('hotjar') ||
                src.includes('facebook') ||
                src.includes('analytics') ||
                src.includes('googletagmanager')
            ) {
                $(el).remove()
            }
        })

        // 3. Injetar Base Tag (Fallback de segurança)
        // $('head').prepend(`<base href="${baseUrl.origin}">`) 
        // Desativado por enquanto pois reescrevemos manualmente acima, o que é mais seguro para edição.

        const title = $('title').text().trim() || 'Página Clonada'
        const metaDescription = $('meta[name="description"]').attr('content') || ''
        let favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || null

        if (favicon && !favicon.startsWith('http')) {
            favicon = new URL(favicon, baseUrl.href).href
        }

        return {
            html: $.html(), // Retorna o HTML processado e limpo
            title,
            metaDescription,
            favicon,
            finalUrl: baseUrl.href
        }

    } catch (error) {
        console.error('Erro no scraper:', error)
        throw error
    }
}
