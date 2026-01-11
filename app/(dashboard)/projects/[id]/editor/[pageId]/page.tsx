
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, ExternalLink } from 'lucide-react'
import EditorForm from './editor-form'
import EditorSidebar from './editor-sidebar'
import ExportActions from './export-actions'

export default async function EditorPage({ params, searchParams }: {
    params: Promise<{ id: string, pageId: string }>,
    searchParams: Promise<{ quickview?: string }>
}) {
    const { id, pageId } = await params
    const { quickview } = await searchParams
    const isQuickView = quickview === 'true'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single()

    if (!page) redirect(`/projects/${id}`)

    return (
        <div className="h-screen flex flex-col bg-gray-950">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900 shadow-xl z-20">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${id}`} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-medium">{page.slug}</h1>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                            {isQuickView ? 'Visualização Rápida' : 'Editando HTML'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isQuickView && (
                        <a
                            href={`/api/export-page?pageId=${pageId}`}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg border border-gray-700 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Ver Tela Cheia
                        </a>
                    )}

                    <ExportActions pageId={pageId} />

                    {isQuickView && (
                        <Link
                            href={`/projects/${id}/editor/${pageId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        >
                            <Save className="w-3.5 h-3.5" />
                            Abrir Editor Completo
                        </Link>
                    )}
                </div>
            </header>

            {/* Editor Area */}
            <main className="flex-1 flex overflow-hidden relative">
                <EditorForm page={page} projectId={id} />
                {/* Sidebar oculta no modo QuickView para foco total na visualização e exportação */}
                {!isQuickView && <EditorSidebar page={page} projectId={id} />}
            </main>
        </div>
    )
}
