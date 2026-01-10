'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createScript(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const name = formData.get('name') as string
    const position = formData.get('position') as 'head' | 'body-end'
    const script_code = formData.get('script_code') as string

    const { error } = await supabase
        .from('scripts')
        .insert({ user_id: user.id, name, position, script_code })

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/scripts')
}

export async function deleteScript(scriptId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', scriptId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/scripts')
}
