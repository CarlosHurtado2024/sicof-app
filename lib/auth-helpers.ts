
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    const { data: profile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()

    return { user, profile }
}
