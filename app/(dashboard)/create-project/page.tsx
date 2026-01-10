
import CreateProjectForm from './create-project-form'

export default function CreateProjectPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Criar Novo Projeto</h1>
                <p className="text-gray-400">
                    Configure os detalhes iniciais da sua oferta ou produto.
                </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl">
                <CreateProjectForm />
            </div>
        </div>
    )
}
