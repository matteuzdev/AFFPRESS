'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Eye, Code, MousePointer2 } from 'lucide-react'
import { savePageContent } from '@/app/projects/actions'

export default function EditorForm({ page, projectId }: { page: any, projectId: string }) {
    const [html, setHtml] = useState(page.html_edited || page.html_raw || '')
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'visual'>('visual')
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Injeta o script do editor quando o HTML é montado para visualização
    const getVisualHtml = () => {
        if (html.includes('editor-client.js')) return html;
        // Injetar script no final do body
        return html.replace('</body>', '<script src="/editor-client.js"></script></body>');
    }

    useEffect(() => {
        // Listener para receber atualizações do iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'AFFPRESS_UPDATE' && event.data.html) {
                // Remove as classes de editor antes de salvar no state principal
                // (O script do cliente já deveria mandar limpo, mas duplamente seguro)
                // Na verdade, o script manda o outerHTML do document, que pode incluir bagunça.
                // Idealmente o script deveria limpar antes de mandar.

                // Por simplificação no MVP, vamos confiar que o user vai salvar.
                // Mas cuidado para não salvar o <script> injetado permanentemente no banco se não quiser.
                // Vou remover o script antes de setar o state.
                const cleanHtml = event.data.html.replace('<script src="/editor-client.js"></script>', '');
                setHtml(cleanHtml);
            }
        }

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    async function handleSave() {
        setSaving(true)
        try {
            // Remove script do editor antes de salvar no banco
            const cleanHtml = html.replace('<script src="/editor-client.js"></script>', '');
            await savePageContent(page.id, projectId, cleanHtml)
            // Atualiza state local para manter sincronizado
            setHtml(cleanHtml)
            alert('Salvo com sucesso!')
        } catch (e) {
            alert('Erro ao salvar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="bg-[#0F0F1B] border-b border-gray-800 px-4 py-2 flex items-center justify-between gap-4">
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button
                        onClick={() => setActiveTab('visual')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <MousePointer2 className="w-4 h-4" /> Visual (Point & Click)
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Eye className="w-4 h-4" /> Preview Final
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Code className="w-4 h-4" /> Código Fonte
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)]"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white/5 relative">
                {activeTab === 'code' ? (
                    <textarea
                        className="flex-1 bg-[#050510] text-gray-300 font-mono text-sm p-4 outline-none resize-none border-none"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        spellCheck={false}
                    />
                ) : (
                    <div className="flex-1 bg-white relative w-full h-full">
                        <iframe
                            ref={iframeRef}
                            title="Editor"
                            srcDoc={activeTab === 'visual' ? getVisualHtml() : html}
                            className="w-full h-full border-none"
                            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
