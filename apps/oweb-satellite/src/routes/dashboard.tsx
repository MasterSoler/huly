import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { AppShell } from '@/components/AppShell'
import { resolveWorkspaceIdForUser } from '@/lib/auth/post-auth'
import { useAuth } from '@/lib/auth/auth-context'
import { requireAuthSession } from '@/lib/auth/route-guards'
import { getHulyUpstreamUrl, owebOnboardingUrl, getOwebAppUrl, HULY_APP_ID } from '@/lib/huly/constants'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuthSession(),
  component: DashboardPage,
})

function DashboardPage() {
  const { user, oneId, loading, setWorkspaceId } = useAuth()
  const upstream = getHulyUpstreamUrl()
  const owebUrl = getOwebAppUrl()
  const [workspaceReady, setWorkspaceReady] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    let cancelled = false
    void (async () => {
      const workspaceId = await resolveWorkspaceIdForUser(user.id)
      if (cancelled) return
      if (!workspaceId) {
        window.location.assign(owebOnboardingUrl())
        return
      }
      setWorkspaceId(workspaceId)
      setWorkspaceReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [loading, user, setWorkspaceId])

  if (loading || !workspaceReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] text-sm text-[var(--sea-ink-soft)]">
        Loading session…
      </div>
    )
  }

  if (upstream) {
    return (
      <div className="flex h-screen flex-col bg-[var(--bg-base)]">
        <header className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2 text-sm">
          <span>
            Huly · {oneId ? `@${oneId}` : user?.email}
          </span>
          <a
            href={upstream}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--lagoon-deep)] underline-offset-4 hover:underline"
          >
            Open in new tab
          </a>
        </header>
        <iframe
          title="Huly workspace"
          src={upstream}
          className="min-h-0 flex-1 border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    )
  }

  return (
    <AppShell>
      <h1 className="display-title text-2xl">Huly workspace</h1>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
        Signed in as {user?.email}
        {oneId ? ` · @${oneId}` : ''}
      </p>

      <section className="mt-8 max-w-xl rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <h2 className="font-semibold text-[var(--sea-ink)]">Connect your Huly backend</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--sea-ink-soft)]">
          This Vercel satellite is the OneID gate for the constellation. Set{' '}
          <code className="text-xs">VITE_HULY_UPSTREAM_URL</code> in the Vercel project to your
          self-hosted Huly front URL (for example the <code className="text-xs">front</code> pod).
          The dashboard will embed that URL after authentication.
        </p>
        <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
          Register <code className="text-xs">{HULY_APP_ID}</code> in OWeb{' '}
          <code className="text-xs">ecosystem-apps.ts</code> and apply the{' '}
          <code className="text-xs">huly_profiles</code> migration in One OS Supabase before App
          Store launch.
        </p>
        <a
          href={`${owebUrl}/app-store`}
          className="mt-4 inline-block text-sm font-medium text-[var(--lagoon-deep)] underline-offset-4 hover:underline"
        >
          Open OWeb App Store
        </a>
      </section>
    </AppShell>
  )
}
