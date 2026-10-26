import type { User } from '@supabase/supabase-js'

import { activateHulyApp } from '@/lib/huly/app-activation'
import { ensureHulyProfile } from '@/lib/huly/ensure-profile'
import { fetchMyWorkspaces } from '@/lib/workspace/workspace-queries'
import { persistWorkspaceId, readStoredWorkspaceId } from '@/lib/workspace/workspace-storage'

/** Run after auth without blocking the Supabase auth lock (see supabase-js #2013). */
export function schedulePostAuthSideEffects(user: User): void {
  queueMicrotask(() => {
    void activateHulyApp(user.id)
    void ensureHulyProfile(user)
  })
}

export async function resolveWorkspaceIdForUser(userId: string): Promise<string | null> {
  const existing = readStoredWorkspaceId()
  if (existing) return existing
  const workspaces = await fetchMyWorkspaces(userId)
  if (workspaces.length === 0) return null
  const id = workspaces[0]!.id
  persistWorkspaceId(id)
  return id
}
