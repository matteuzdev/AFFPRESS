'use client'

import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F1B] transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {pending ? 'Criando...' : 'Criar Conta Grátis'}
        </button>
    )
}

export default function SignupPage() {
    const [state, formAction] = useActionState(signup as any, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050510] p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">AFFPRESS</h1>
                    <h2 className="text-xl font-medium text-gray-300">Comece sua jornada</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Estrutura própria profissional em segundos.
                    </p>
                </div>

                <div className="rounded-2xl bg-[#0F0F1B]/60 backdrop-blur-xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800">
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-xl border border-gray-700/50 bg-[#1E1E2E]/50 px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all outline-none"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-xl border border-gray-700/50 bg-[#1E1E2E]/50 px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
