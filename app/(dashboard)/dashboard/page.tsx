
import Link from 'next/link'
import { Plus, LayoutTemplate } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CloneHero from './clone-hero'
import ProjectCard from './project-card'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            {/* Hero Section: Clone URL */}
            <CloneHero />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Meus Projetos
                    </h2>
                    <p className="text-gray-400 mt-1">Gerencie suas páginas clonadas.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0F0F1B] border border-gray-800/50 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
                    <h3 className="text-gray-400 text-sm font-medium">Projetos Ativos</h3>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">{projects?.length || 0}</span>
                    </div>
                </div>
                <div className="bg-[#0F0F1B] border border-gray-800/50 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all"></div>
                    <h3 className="text-gray-400 text-sm font-medium">Cliques (Hoje)</h3>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">0</span>
                        <span className="text-gray-500 text-xs mb-1">Em breve</span>
                    </div>
                </div>
                <div className="bg-[#0F0F1B] border border-gray-800/50 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                    <h3 className="text-gray-400 text-sm font-medium">Taxa de Conversão</h3>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">0%</span>
                        <span className="text-gray-500 text-xs mb-1">Em breve</span>
                    </div>
                </div>
            </div>

            {!projects?.length ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-2xl bg-[#0F0F1B]/50 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 pointer-events-none"></div>
                    <div className="bg-gray-800/50 p-4 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                        <LayoutTemplate className="w-8 h-8 text-indigo-400 relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sua estrutura está vazia</h3>
                    <p className="text-gray-400 max-w-sm mb-4">
                        Cole uma URL ou código fonte no formulário acima para clonar sua primeira página.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    )
}
