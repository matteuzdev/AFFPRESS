'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'

export default function ImportPageForm({ projectId }: { projectId: string }) {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleImport(e: React.FormEvent) {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        try {
            const res = await fetch('/api/import-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, projectId })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erro ao importar')
            }

            setUrl('')
            router.refresh()
        } catch (error) {
            alert('Erro ao clonar página: ' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleImport} className="flex gap-2">
            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://pagina-exemplo.com/vsl"
                required
                className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {loading ? 'Clonando...' : 'Clonar'}
            </button>
        </form>
    )
}
