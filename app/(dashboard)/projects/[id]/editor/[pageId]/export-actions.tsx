'use client'

import { Download, FileCode } from 'lucide-react'

export default function ExportActions({ pageId }: { pageId: string }) {

    const handleExportHtml = () => {
        window.location.href = `/api/export-page?pageId=${pageId}&download=true`
    }

    return (
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button
                onClick={handleExportHtml}
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-all flex items-center gap-2"
            >
                <FileCode className="w-4 h-4" /> Exportar HTML
            </button>
            {/* ZIP export would go here */}
        </div>
    )
}
