
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Wand2 } from 'lucide-react'
import CreatePresselForm from './create-pressel-form'

export default async function CreatePresselPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Criar Pressel</h1>
                <p className="text-gray-400">
                    Escolha um template e crie sua página de pré-venda em segundos.
                </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <CreatePresselForm projectId={params.id} />
            </div>
        </div>
    )
}
