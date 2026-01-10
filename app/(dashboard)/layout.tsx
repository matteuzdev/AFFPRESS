
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Plus, Settings, LogOut, Code2, Rocket, Menu } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-[#050510] flex font-sans text-gray-100 selection:bg-indigo-500/30">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-72 border-r border-[#1E1E2E] bg-[#0F0F1B]/80 backdrop-blur-xl hidden md:flex flex-col relative z-20">
                <div className="h-20 flex items-center px-8 border-b border-[#1E1E2E]">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
                        AFFPRESS
                    </span>
                    <span className="ml-2 text-[10px] uppercase font-bold text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">
                        v2.0
                    </span>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu Principal</p>

                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-white bg-indigo-600/10 border border-indigo-500/20 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.1)] hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:border-indigo-500/40"
                    >
                        <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        Dashboard
                    </Link>

                    <Link
                        href="/create-project"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        Novo Projeto
                    </Link>

                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">Ferramentas</p>

                    <Link
                        href="/scripts"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all"
                    >
                        <Code2 className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        Scripts & Pixels
                    </Link>
                    <Link
                        href="#"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all opacity-50 cursor-not-allowed"
                        title="Em breve na v2.0"
                    >
                        <Rocket className="w-5 h-5" />
                        Integrações (Em breve)
                    </Link>
                </nav>

                <div className="p-6 border-t border-[#1E1E2E]">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all mb-2"
                    >
                        <Settings className="w-5 h-5" />
                        Configurações
                    </Link>
                    <form action={signout}>
                        <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                            <LogOut className="w-5 h-5" />
                            Sair da Conta
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-[#0F0F1B]/90 backdrop-blur border-b border-[#1E1E2E] flex items-center justify-between px-4 sticky top-0 z-50">
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AFFPRESS</span>
                    <button className="p-2 text-gray-400">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-10 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
