'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Plus, Settings, LogOut, Code2, Rocket, Menu, X } from 'lucide-react'
import { signout } from '@/app/auth/actions'

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden h-16 bg-[#0F0F1B]/90 backdrop-blur-xl border-b border-[#1E1E2E] flex items-center justify-between px-4 sticky top-0 z-50">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AFFPRESS</span>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <aside className={`fixed top-0 right-0 bottom-0 w-80 bg-[#0F0F1B] border-l border-[#1E1E2E] z-[70] transition-transform duration-300 transform md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-[#1E1E2E]">
                    <span className="text-xl font-bold text-white">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-6 space-y-2">
                    <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-white bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                    >
                        <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                        Dashboard
                    </Link>

                    <Link
                        href="/create-project"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Projeto
                    </Link>

                    <Link
                        href="/scripts"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-400 hover:text-white hover:bg-[#1E1E2E] rounded-xl transition-all"
                    >
                        <Code2 className="w-5 h-5" />
                        Scripts & Pixels
                    </Link>

                    <div className="pt-8 border-t border-[#1E1E2E] mt-8 flex flex-col gap-2">
                        <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-400"
                        >
                            <Settings className="w-5 h-5" />
                            Configurações
                        </Link>
                        <form action={signout}>
                            <button className="flex w-full items-center gap-3 px-4 py-4 text-base font-medium text-red-400 hover:bg-red-500/10 rounded-xl">
                                <LogOut className="w-5 h-5" />
                                Sair da Conta
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>
        </>
    )
}
