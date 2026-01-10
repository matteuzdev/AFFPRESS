'use client'

import { useState, useRef, useEffect } from 'react'
import { Link2, ArrowRight, MessageCircle, ShieldCheck, Zap, Download, ExternalLink, RefreshCw } from 'lucide-react'
import { replaceLinks } from '@/app/links/actions'
import { savePageConfig } from '@/app/projects/actions'

interface LinkItem {
    original: string
    new: string
}

export default function EditorSidebar({ page, projectId }: { page: any, projectId: string }) {
    const [activeTab, setActiveTab] = useState<'links' | 'whatsapp' | 'pixels'>('links')
    const [waNumber, setWaNumber] = useState(page.whatsapp_number || '')
    const [waMessage, setWaMessage] = useState(page.whatsapp_message || 'Olá! Vim pelo site.')
    const [saving, setSaving] = useState(false)
    const [detectedLinks, setDetectedLinks] = useState<string[]>([])

    // Extrair links do HTML para sugestão
    useEffect(() => {
        if (page.html_edited) {
            const doc = new DOMParser().parseFromString(page.html_edited, 'text/html')
            const links = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href && href.startsWith('http') && !href.includes(window.location.host))
            setDetectedLinks(Array.from(new Set(links)))
        }
    }, [page.html_edited])

    async function handleSaveWhatsApp(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            // Note: If columns don't exist, this might fail, but we'll try to find a way
            // For now, let's assume the user might have added them or we'll handle gracefully
            await savePageConfig(page.id, projectId, {
                whatsapp_number: waNumber,
                whatsapp_message: waMessage
            })
            alert('Configuração de WhatsApp salva!')
        } catch (err) {
            alert('Erro ao salvar WhatsApp. (Talvez o banco precise de atualização)')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-[#0F0F1B] border-l border-gray-800 w-80 flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-800 bg-gray-900/50">
                <button
                    onClick={() => setActiveTab('links')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'links' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Links
                </button>
                <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'whatsapp' ? 'text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    WhatsApp
                </button>
                <button
                    onClick={() => setActiveTab('pixels')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'pixels' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Pixels
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">
                {activeTab === 'links' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <Zap className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-tight">Troca Global de Links</h3>
                        </div>

                        <form
                            action={async (formData) => {
                                await replaceLinks(page.id, projectId, formData)
                                alert('Links substituídos com sucesso!')
                                window.location.reload()
                            }}
                            className="space-y-4 bg-gray-900/40 p-3 rounded-xl border border-gray-800"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Link Original</label>
                                <input
                                    name="original_url"
                                    list="detected-links"
                                    placeholder="https://pagina.com/checkout"
                                    required
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                                />
                                <datalist id="detected-links">
                                    {detectedLinks.map(link => <option key={link} value={link} />)}
                                </datalist>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className="w-4 h-4 text-gray-700" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-indigo-400 uppercase">Seu Link de Afiliado</label>
                                <input
                                    name="new_url"
                                    placeholder="https://kiwify.com.br/..."
                                    required
                                    className="w-full bg-indigo-500/5 border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-indigo-100 placeholder-indigo-500/30 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all">
                                Substituir Todos
                            </button>
                        </form>

                        <div className="pt-2">
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                <ShieldCheck className="w-3 h-3 inline mr-1" />
                                Detectamos <b>{detectedLinks.length}</b> links na página. Use o campo acima para substituir todos de uma vez.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'whatsapp' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                            <MessageCircle className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-tight">Botão de WhatsApp</h3>
                        </div>

                        <form onSubmit={handleSaveWhatsApp} className="space-y-4 bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Número (com DDD)</label>
                                <input
                                    type="text"
                                    value={waNumber}
                                    onChange={(e) => setWaNumber(e.target.value)}
                                    placeholder="5511999999999"
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-green-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Mensagem Padrão</label>
                                <textarea
                                    value={waMessage}
                                    onChange={(e) => setWaMessage(e.target.value)}
                                    rows={3}
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-green-500 outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : 'Ativar Widget'}
                            </button>
                        </form>

                        <p className="text-[10px] text-gray-600 leading-relaxed">
                            O botão flutuante aparecerá no canto inferior direito da sua página exportada.
                        </p>
                    </div>
                )}

                {activeTab === 'pixels' && (
                    <div className="space-y-4">
                        <div className="px-2 py-4 text-center border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                            <RefreshCw className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">
                                Por padrão, todos os seus <b>Scripts Globais</b> são injetados automaticamente na exportação.
                            </p>
                            <a href="/scripts" className="text-indigo-400 text-[10px] mt-2 block hover:underline">Gerenciar Biblioteca de Scripts &rarr;</a>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-gray-950 border-t border-gray-800">
                <button
                    onClick={() => window.open(`/api/export-page?pageId=${page.id}&download=true`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all"
                >
                    <Download className="w-4 h-4" />
                    Baixar Página Pronta
                </button>
            </div>
        </div>
    )
}
