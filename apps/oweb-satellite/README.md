# Huly — OWeb satellite

OWeb constellation entry point for [Huly](https://huly.io): OneID / Supabase Auth gate, SSO redeem, and optional embed of a self-hosted Huly front URL.

## Satellite contract

Follows [SATELLITE_ONBOARDING_KIT](https://github.com/OneWeb-LLC/oweb/blob/main/docs/SATELLITE_ONBOARDING_KIT.md):

1. Shared Auth at One OS (`ao-supabase-auth` session key)
2. Namespaced projection table `huly_profiles` (see `supabase/migrations/`)
3. Continue with OWeb + `/sso?launch_token=` redeem
4. App Store `app_id = huly` (register in OWeb `ecosystem-apps.ts` before launch)
5. OneID activation via `ao_upsert_app_activation`

## Local

```bash
cd apps/oweb-satellite
cp .env.example .env
npm install
npm run dev
```

Dev server: `http://localhost:3000`

## Deploy (Vercel)

| Setting | Value |
| --- | --- |
| Team | `oweb` (One Web LLC) |
| Project | `huly-oweb` |
| Root directory | `apps/oweb-satellite` |
| Framework | TanStack Start (see `vercel.json`) |

Copy Supabase and OWeb URL variables from the `oweb` or `cube-oweb` Vercel projects. Set `VITE_HULY_PUBLIC_URL` to the deployment URL and `VITE_HULY_UPSTREAM_URL` to your self-hosted Huly front when ready.

Until TanStack packages are upgraded in lockstep, set `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS=1` on the Vercel project (same as the pinned `cube` satellite lockfile).

## Backend note

The Rush monorepo under the repository root is the full Huly platform (Docker pods, CockroachDB, etc.) and does not run on Vercel. This satellite is the customer-facing OneID shell; point `VITE_HULY_UPSTREAM_URL` at your `front` pod or other hosted UI.
