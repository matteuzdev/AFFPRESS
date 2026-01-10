'use client'

import { useRef } from 'react'
import { createScript } from '@/app/scripts/actions'
import { Plus } from 'lucide-react'

export default function CreateScriptForm() {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={formRef}
            action={async (formData) => {
                await createScript(formData)
                formRef.current?.reset()
            }}
            className="space-y-5"
        >
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identificação</label>
                <input
                    name="name"
                    placeholder="Ex: Main Pixel FB - Conta Pro"
                    required
                    className="w-full bg-[#1E1E2E]/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Local de Injeção</label>
                <div className="relative">
                    <select
                        name="position"
                        className="w-full bg-[#1E1E2E]/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none transition-all"
                    >
                        <option value="head" className="bg-[#0F0F1B]">Dentro de &lt;HEAD&gt; (Recomendado para Pixels)</option>
                        <option value="body-end" className="bg-[#0F0F1B]">No fim de &lt;BODY&gt; (Para widgets/chat)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Snippet de Código</label>
                <textarea
                    name="script_code"
                    required
                    placeholder="Cole seu script aqui (Facebook, Google, TikTok...)"
                    rows={6}
                    className="w-full bg-[#050510] border border-gray-700/50 rounded-xl px-4 py-3 text-xs text-green-400 font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-gray-700 resize-none"
                    spellCheck={false}
                />
            </div>

            <button className="w-full group bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Salvar Integração
            </button>
        </form>
    )
}
