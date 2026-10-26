import { supabase } from '@/integrations/supabase/client'
import { HULY_ACTIVATION_KIND, HULY_APP_ID } from '@/lib/huly/constants'

export async function activateHulyApp(userId: string): Promise<void> {
  const { error } = await supabase.rpc('ao_upsert_app_activation', {
    p_app_id: HULY_APP_ID,
    p_user_id: userId,
    p_activation_kind: HULY_ACTIVATION_KIND,
  })
  if (error) console.warn('[huly] app activation failed', error.message)
}
