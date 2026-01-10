'use client'

import { createProject } from '@/app/projects/actions'
import { Loader2 } from 'lucide-react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {pending ? 'Criando...' : 'Criar Projeto'}
        </button>
    )
}

export default function CreateProjectForm() {
    const [state, formAction] = useActionState(createProject as any, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Ex: Campanha Black Friday - Offer X"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500">Nome interno para sua organização.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="offer_name" className="block text-sm font-medium text-gray-300">
                        Nome da Oferta
                    </label>
                    <input
                        type="text"
                        name="offer_name"
                        id="offer_name"
                        placeholder="Ex: SlimCaps"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="geo" className="block text-sm font-medium text-gray-300">
                        GEO (País)
                    </label>
                    <select
                        name="geo"
                        id="geo"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                        <option value="BR">Brasil 🇧🇷</option>
                        <option value="US">Estados Unidos 🇺🇸</option>
                        <option value="PT">Portugal 🇵🇹</option>
                        <option value="ES">Espanha 🇪🇸</option>
                        <option value="LATAM">LATAM 🌎</option>
                        <option value="OTHER">Outro</option>
                    </select>
                </div>
            </div>

            {state?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">
                    {state.error}
                </div>
            )}

            <div className="pt-4 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    Cancelar
                </button>
                <SubmitButton />
            </div>
        </form>
    )
}
