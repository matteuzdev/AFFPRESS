
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, ExternalLink } from 'lucide-react'
import EditorForm from './editor-form'
import EditorSidebar from './editor-sidebar'
import ExportActions from './export-actions'

export default async function EditorPage({ params }: { params: Promise<{ id: string, pageId: string }> }) {
    const { id, pageId } = await params
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
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${id}`} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-medium">{page.slug}</h1>
                        <p className="text-xs text-gray-500">Editando HTML</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.open(`/api/export-page?pageId=${pageId}`, '_blank')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg border border-gray-700 transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver Tela Cheia
                    </button>
                    <ExportActions pageId={pageId} />
                </div>
            </header>

            {/* Editor Area */}
            <main className="flex-1 flex overflow-hidden relative">
                <EditorForm page={page} projectId={id} />
                {/* Right Sidebar: Unified Management */}
                <EditorSidebar page={page} projectId={id} />
            </main>
        </div>
    )
}
