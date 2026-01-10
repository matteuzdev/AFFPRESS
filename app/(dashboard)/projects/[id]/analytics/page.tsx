import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, BarChart3, TrendingUp, Users, MousePointer2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 1. Fetch Project
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!project) redirect('/dashboard')

    // 2. Fetch Metrics (handling potential missing table)
    let metrics: any[] = []
    let metricsError = null

    try {
        const { data, error } = await supabase
            .from('metrics')
            .select(`
                *,
                pages (slug)
            `)
            .in('page_id', (await supabase.from('pages').select('id').eq('project_id', id)).data?.map(p => p.id) || [])
            .order('created_at', { ascending: false })

        if (error) metricsError = error
        else metrics = data || []
    } catch (e: any) {
        metricsError = e
    }

    const views = metrics.filter(m => m.event_type === 'view').length
    const clicks = metrics.filter(m => m.event_type === 'click').length
    const cr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0'

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-all text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-400" />
                            Analytics: {project.name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Dados de tráfego e conversão em tempo real.</p>
                    </div>
                </div>
            </div>

            {/* Warning if metrics table missing */}
            {metricsError && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-amber-400">Configuração de Banco Necessária</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Detectamos que a tabela de métricas ainda não foi criada no seu Supabase.
                            Para ativar o rastreamento profissional (cliques, views e CR), execute o script SQL que o assistente forneceu no chat original.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0F0F1B] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Visitas (PV)</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{views}</div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        +0% desde o início
                    </div>
                </div>

                <div className="bg-[#0F0F1B] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <MousePointer2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Cliques no Link</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{clicks}</div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {clicks > 0 ? '+100%' : 'Aguardando cliques'}
                    </div>
                </div>

                <div className="bg-[#0F0F1B] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Taxa de Conversão</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{cr}%</div>
                    <div className="text-xs text-gray-500 mt-2">Cliques vs Visitas</div>
                </div>
            </div>

            {/* List of recent events */}
            <div className="bg-[#0F0F1B] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="font-bold text-white">Últimos Eventos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900/50">
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Página</th>
                                <th className="px-6 py-4">Detalhes</th>
                                <th className="px-6 py-4">Data/Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {metrics.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                        Nenhum evento registrado ainda. Envie tráfego para suas páginas clonadas!
                                    </td>
                                </tr>
                            ) : (
                                metrics.slice(0, 10).map(metric => (
                                    <tr key={metric.id} className="hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${metric.event_type === 'click' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-indigo-500/10 text-indigo-400'
                                                }`}>
                                                {metric.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            /{metric.pages?.slug}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono text-gray-500 truncate max-w-xs">
                                            {JSON.stringify(metric.metadata)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(metric.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
