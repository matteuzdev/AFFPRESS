'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Edit3, ExternalLink, Globe, Loader2, Activity } from 'lucide-react'

interface Project {
    id: string
    name: string
    offer_name: string | null
    geo: string | null
    status: string
    created_at: string
}

interface ProjectCardProps {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const [deleting, setDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setDeleting(true)
        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert('Erro ao excluir projeto')
            }
        } catch (error) {
            alert('Erro ao excluir projeto')
        } finally {
            setDeleting(false)
            setShowConfirm(false)
        }
    }

    return (
        <div className="group relative bg-[#0F0F1B] border border-gray-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] flex flex-col">
            {/* Card Header / Preview Area */}
            <div className="h-32 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 relative border-b border-gray-800 group-hover:border-indigo-500/20 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F1B]/90"></div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${project.status === 'ready'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>
                        {project.status === 'ready' ? 'ATIVO' : project.status}
                    </span>
                </div>

                {/* Delete Button (top left) - Always visible or easier to touch on mobile */}
                <div className="absolute top-3 left-3 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity opacity-100">
                    {showConfirm ? (
                        <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1 shadow-lg">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-bold disabled:opacity-50"
                            >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apagar'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded font-bold"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-2 bg-gray-900/90 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors border border-gray-700 hover:border-red-500 shadow-xl"
                            title="Excluir projeto"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* GEO info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs text-gray-300 font-medium">
                    <div className="bg-gray-900/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>{project.geo || 'Global'}</span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-white text-base mb-1 truncate group-hover:text-indigo-400 transition-colors">
                    {project.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6 truncate">
                    {project.offer_name || 'Sem oferta definida'}
                </p>

                <div className="mt-auto flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 text-center bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Gerenciar
                        </Link>
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 text-center bg-[#1E1E2E] hover:bg-[#2A2A3E] text-xs font-bold text-gray-300 py-3 rounded-xl transition-all border border-gray-700 active:scale-95 shadow-lg"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Ver Páginas
                        </Link>
                    </div>
                    <Link
                        href={`/projects/${project.id}/analytics`}
                        className="flex items-center justify-center gap-2 w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-[11px] font-bold text-cyan-400 py-2.5 rounded-xl transition-all border border-cyan-500/20 hover:border-cyan-500/40 active:scale-95 shadow-lg shadow-cyan-500/5 uppercase tracking-wider"
                    >
                        <Activity className="w-3.5 h-3.5" />
                        Analytics
                    </Link>
                </div>
            </div>
        </div>
    )
}
