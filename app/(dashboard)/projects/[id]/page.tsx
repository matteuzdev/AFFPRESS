
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Copy, FileText, ExternalLink, Settings } from 'lucide-react'
import { redirect } from 'next/navigation'
import ImportPageForm from './import-form'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!project) {
        redirect('/dashboard')
    }

    const { data: pages } = await supabase
        .from('pages')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>
                <span>/</span>
                <span className="text-white font-medium">{project.name}</span>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                    <p className="text-gray-400">
                        {project.offer_name && `Oferta: ${project.offer_name}`}
                        {project.geo && ` • GEO: ${project.geo}`}
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" /> Configurações
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Pages List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Páginas</h2>

                        {!pages?.length ? (
                            <div className="space-y-4">
                                <Link
                                    href={`/projects/${project.id}/create-pressel`}
                                    className="text-center block w-full py-4 border-2 border-dashed border-gray-800 rounded-lg hover:border-gray-600 hover:bg-gray-800 transition-all group"
                                >
                                    <p className="text-gray-400 group-hover:text-white font-medium flex items-center justify-center gap-2">
                                        <span className="text-2xl">+</span> Criar Pressel
                                    </p>
                                </Link>
                                <ImportPageForm projectId={project.id} />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pages.map(page => (
                                    <div key={page.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-500/10 p-2 rounded-lg">
                                                {page.type === 'cloned' ? <Copy className="w-5 h-5 text-indigo-400" /> : <FileText className="w-5 h-5 text-green-400" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{page.slug}</h4>
                                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{page.source_url || 'Página criada do zero'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/projects/${project.id}/editor/${page.id}`}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Editar
                                            </Link>
                                            {/* Placeholder for export/preview */}
                                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-8 pt-4 border-t border-gray-800">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">Adicionar Nova Página</p>
                                    <ImportPageForm projectId={project.id} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Project Stats/Quick Links (Placeholder for MVP) */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Ações Rápidas</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                                Gerenciar Pixels & Scripts
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                                Configurar Links de Afiliado
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                                Exportar Projeto Completo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
