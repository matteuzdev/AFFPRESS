import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verifica se o projeto pertence ao usuário
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

    if (!project) {
        return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Deleta páginas do projeto primeiro (cascade manual)
    await supabase.from('pages').delete().eq('project_id', projectId)

    // Deleta o projeto
    const { error } = await supabase.from('projects').delete().eq('id', projectId)

    if (error) {
        return NextResponse.json({ error: 'Falha ao excluir projeto' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
