'use client'

import { useRef } from 'react'
import { Link2, ArrowRight } from 'lucide-react'
import { replaceLinks } from '@/app/links/actions'

export default function LinkManager({ pageId, projectId }: { pageId: string, projectId: string }) {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <div className="bg-gray-900 border-l border-gray-800 w-80 flex flex-col h-full bg-gray-950">
            <div className="p-4 border-b border-gray-800">
                <h3 className="text-white font-medium flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Links de Afiliado
                </h3>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-auto">
                <form
                    ref={formRef}
                    action={async (formData) => {
                        await replaceLinks(pageId, projectId, formData)
                        formRef.current?.reset()
                        alert('Links substituídos com sucesso!')
                        // Force reload to see changes in iframe if not reactive
                        window.location.reload()
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Link Original (na página)</label>
                        <input
                            name="original_url"
                            placeholder="https://..."
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                        />
                    </div>

                    <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-indigo-400">Seu Link de Afiliado</label>
                        <input
                            name="new_url"
                            placeholder="https://go.hotmart.com/..."
                            required
                            className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded px-2 py-1.5 text-xs text-indigo-200 placeholder-indigo-500/50"
                        />
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-xs font-medium">
                        Substituir Todos
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-[10px] text-gray-600">
                        Esta ação irá buscar todas as ocorrências do link original no HTML e substituir pelo seu link de afiliado.
                    </p>
                </div>
            </div>
        </div>
    )
}
