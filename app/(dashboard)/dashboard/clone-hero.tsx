'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Loader2, Zap, ArrowRight, Sparkles, Code, Link2, HelpCircle } from 'lucide-react'

type CloneMode = 'url' | 'source'

export default function CloneHero() {
    const [mode, setMode] = useState<CloneMode>('url')
    const [url, setUrl] = useState('')
    const [sourceCode, setSourceCode] = useState('')
    const [pageName, setPageName] = useState('')
    const [affiliateLink, setAffiliateLink] = useState('')
    const [presellType, setPresellType] = useState<'direct' | 'quiz' | 'advertorial' | 'listicle'>('direct')
    const [pixelCode, setPixelCode] = useState('')
    const [geo, setGeo] = useState('US')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleClone(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/quick-clone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: mode === 'url' ? url : undefined,
                    sourceCode: mode === 'source' ? sourceCode : undefined,
                    pageName: pageName || undefined,
                    affiliateLink: affiliateLink || undefined,
                    presellType,
                    pixelCode: pixelCode || undefined,
                    geo
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erro ao clonar')
            }

            const { projectId, pageId } = await res.json()
            router.push(`/projects/${projectId}/editor/${pageId}`)
        } catch (err: any) {
            setError(err.message || 'Erro ao clonar página')
            setLoading(false)
        }
    }

    return (
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/20 via-[#0F0F1B] to-purple-900/20 border border-indigo-500/20 p-6 md:p-10 overflow-hidden mb-8">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Clone em Segundos</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                        Transforme qualquer página em <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">sua estrutura.</span>
                    </h1>
                </div>

                {/* Mode Tabs */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'url'
                            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                            : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
                    >
                        <Link2 className="w-4 h-4" />
                        Via URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('source')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'source'
                            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                            : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
                    >
                        <Code className="w-4 h-4" />
                        Código Fonte
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">100%</span>
                    </button>
                </div>

                <form onSubmit={handleClone} className="space-y-4">
                    {mode === 'url' ? (
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://pagina-do-produtor.com/oferta"
                                required
                                disabled={loading}
                                className="w-full bg-[#050510] border-2 border-gray-700/50 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-base transition-all disabled:opacity-50"
                            />
                            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                                <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span>Abra a página do produtor → Pressione <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">Ctrl+U</kbd> → Copie tudo (<kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">Ctrl+A</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">Ctrl+C</kbd>) → Cole abaixo</span>
                            </div>
                            <input
                                type="text"
                                value={pageName}
                                onChange={(e) => setPageName(e.target.value)}
                                placeholder="Nome da página (ex: VSL SlimCaps)"
                                className="w-full bg-[#050510] border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500 outline-none text-sm transition-all"
                            />
                            <textarea
                                value={sourceCode}
                                onChange={(e) => setSourceCode(e.target.value)}
                                placeholder="Cole o código fonte HTML aqui..."
                                required
                                disabled={loading}
                                rows={6}
                                className="w-full bg-[#050510] border-2 border-gray-700/50 rounded-xl px-4 py-3 text-green-400 font-mono text-xs placeholder-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 resize-none"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                Seu Link de Afiliado (Auto-Replace)
                            </label>
                            <input
                                type="url"
                                value={affiliateLink}
                                onChange={(e) => setAffiliateLink(e.target.value)}
                                placeholder="https://kiwify.com.br/..."
                                className="w-full bg-[#050510] border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 outline-none text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                                Tipo de Presell (USA Context)
                            </label>
                            <select
                                value={presellType}
                                onChange={(e) => setPresellType(e.target.value as any)}
                                className="w-full bg-[#050510] border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none text-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="direct">🚫 Sem Presell (Clonagem Direta)</option>
                                <option value="quiz">📝 Quiz Interativo (Alta Conversão)</option>
                                <option value="cookie">🍪 Consentimento de Cookies (Blur/Redirect)</option>
                                <option value="advertorial">📰 Advertorial (Scientific/News)</option>
                                <option value="listicle">🔟 Listicle (10 Razões/Solução)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                                GEO (País do Tráfego)
                            </label>
                            <select
                                value={geo}
                                onChange={(e) => setGeo(e.target.value)}
                                className="w-full bg-[#050510] border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none text-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="US">🇺🇸 Estados Unidos (Recomendado)</option>
                                <option value="BR">🇧🇷 Brasil</option>
                                <option value="CA">🇨🇦 Canadá</option>
                                <option value="UK">🇬🇧 Reino Unido</option>
                                <option value="EU">🇪🇺 Europa (Geral)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <Code className="w-3 h-3 text-purple-400" />
                            Pixel / Script de Rastreamento (Opcional)
                        </label>
                        <textarea
                            value={pixelCode}
                            onChange={(e) => setPixelCode(e.target.value)}
                            placeholder="<!-- Cole seu Pixel aqui (FB, GTM, etc.) -->"
                            rows={2}
                            className="w-full bg-[#050510] border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 outline-none text-xs transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (mode === 'url' ? !url : !sourceCode)}
                        className="w-full group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Preparando Funil...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Gerar Estrutura Própria
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-center">
                            {error}
                        </div>
                    )}
                </form>

                <p className="text-gray-500 text-xs mt-4 text-center">
                    Funciona com: Hotmart, Kiwify, Eduzz, Monetizze, Braip e qualquer página pública.
                </p>
            </div>
        </div>
    )
}
