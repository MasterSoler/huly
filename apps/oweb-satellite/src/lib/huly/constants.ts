export const HULY_APP_ID = 'huly' as const
export const HULY_ACTIVATION_KIND = 'session' as const
export const HULY_DEFAULT_PUBLIC_URL = 'https://huly-oweb.vercel.app'

export function getOwebAppUrl(): string {
  const fromEnv =
    import.meta.env.VITE_OWEB_APP_URL ||
    (typeof process !== 'undefined' ? process.env.VITE_OWEB_APP_URL : undefined)
  return (fromEnv || 'https://oweb.one').replace(/\/$/, '')
}

export function getHulyPublicUrl(): string {
  const fromEnv =
    import.meta.env.VITE_HULY_PUBLIC_URL ||
    (typeof process !== 'undefined' ? process.env.VITE_HULY_PUBLIC_URL : undefined)
  return (fromEnv || HULY_DEFAULT_PUBLIC_URL).replace(/\/$/, '')
}

/** Self-hosted Huly front / workspace URL (opened after OneID gate). */
export function getHulyUpstreamUrl(): string | null {
  const fromEnv =
    import.meta.env.VITE_HULY_UPSTREAM_URL ||
    (typeof process !== 'undefined' ? process.env.VITE_HULY_UPSTREAM_URL : undefined)
  const trimmed = (fromEnv || '').trim()
  return trimmed ? trimmed.replace(/\/$/, '') : null
}

export function owebLoginUrl(options?: { launch?: boolean }): string {
  const url = new URL('/login', getOwebAppUrl())
  if (options?.launch) url.searchParams.set('launch', HULY_APP_ID)
  return url.toString()
}

export function owebOnboardingUrl(): string {
  const url = new URL('/onboarding', getOwebAppUrl())
  url.searchParams.set('launch', HULY_APP_ID)
  return url.toString()
}

export function isAuthRequired(): boolean {
  if (import.meta.env.DEV && !import.meta.env.VITE_HULY_REQUIRE_AUTH) return false
  const flag =
    import.meta.env.VITE_HULY_REQUIRE_AUTH ||
    (typeof process !== 'undefined' ? process.env.HULY_REQUIRE_AUTH : undefined)
  return flag === 'true' || flag === '1'
}
