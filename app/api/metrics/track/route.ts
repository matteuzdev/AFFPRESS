import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    // Note: This needs to use a service role or a public insertion policy in the database
    // For now, let's use the standard client which might be restricted by RLS for public inserts
    // unless the 'Allow public to insert metrics' policy is applied.

    try {
        const supabase = await createClient()
        const { pageId, eventType, metadata } = await request.json()

        if (!pageId || !eventType) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 })
        }

        const { error } = await supabase
            .from('metrics')
            .insert({
                page_id: pageId,
                event_type: eventType,
                metadata: metadata || {}
            })

        if (error) {
            console.error('[metrics] Supabase Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
