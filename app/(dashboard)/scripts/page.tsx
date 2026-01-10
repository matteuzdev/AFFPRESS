
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trash2, Code2, Plus } from 'lucide-react'
import { createScript, deleteScript } from '@/app/scripts/actions'
import CreateScriptForm from './create-script-form'

export default async function ScriptsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Meus Scripts</h1>
                    <p className="text-gray-400 mt-1">
                        Gerencie pixels e códigos de rastreamento (Facebook, Google, etc.).
                    </p>
                </div>
                <div className="hidden md:block">
                    {/* Placeholder para alguma ação extra no futuro */}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List of Scripts */}
                <div className="xl:col-span-2 space-y-4">
                    {!scripts?.length ? (
                        <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-[#0F0F1B]/50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 pointer-events-none"></div>
                            <Code2 className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                            <h3 className="text-white font-medium mb-1">Nenhum script encontrado</h3>
                            <p className="text-gray-500 text-sm">Adicione seu Pixel ou Analytics ao lado.</p>
                        </div>
                    ) : (
                        scripts.map(script => (
                            <div key={script.id} className="bg-[#0F0F1B] border border-gray-800 overflow-hidden hover:border-indigo-500/30 p-6 rounded-2xl flex items-start justify-between group transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] relative">
                                <div className="space-y-2 relative z-10 w-full mr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                                            <Code2 className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <h3 className="font-semibold text-white">
                                            {script.name}
                                        </h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${script.position === 'head' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                                            {script.position === 'head' ? '<HEAD>' : '<BODY>'}
                                        </span>
                                    </div>
                                    <pre className="text-xs text-gray-500 bg-[#050510] border border-gray-800 p-3 rounded-lg w-full overflow-hidden text-ellipsis font-mono">
                                        {script.script_code.slice(0, 150)}...
                                    </pre>
                                </div>
                                <div className="flex flex-col gap-2 relative z-10">
                                    <form action={deleteScript.bind(null, script.id)}>
                                        <button className="text-gray-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10" title="Excluir Script">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Script Form */}
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                    <div className="bg-[#0F0F1B] border border-gray-800 rounded-2xl p-6 sticky top-8 relative z-10">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-500" />
                            Novo Token de Rastreamento
                        </h2>
                        <CreateScriptForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
