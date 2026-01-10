'use client'

import { createPressel } from '@/app/pressel/actions'

export default function CreatePresselForm({ projectId }: { projectId: string }) {
    return (
        <form action={createPressel.bind(null, projectId)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Template</label>
                    <select
                        name="template"
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="simple">Simples (VSL/Texto)</option>
                        <option value="story">Advertorial / Storytelling</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Headline (Manchete)</label>
                    <input
                        name="headline"
                        required
                        placeholder="Ex: O segredo para..."
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Conteúdo Principal (Corpo)</label>
                <textarea
                    name="body"
                    required
                    rows={8}
                    placeholder="Escreva aqui o texto da sua pressel..."
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
            </div>

            <div className="flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/20 transition-all">
                    Gerar Pressel & Editar HTML
                </button>
            </div>
        </form>
    )
}
