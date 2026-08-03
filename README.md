# Next.js front end

A Next.js 16 front end for the decoupled Drupal + Next.js starter. It renders content from the
Drupal 11 backend in [`../drupal`](../drupal) over JSON:API, and is prepared to deploy as a
**Pantheon Front-End Site**.

## Stack

- Next.js 16 (App Router) with React 19 and Tailwind CSS 4.
- Its own DDEV project, `d11-nextjs-fe` (generic type, Node 22), reverse-proxied to
  `https://d11-nextjs-fe.ddev.site`.
- Data layer in `src/lib` (`drupal-fetch.ts`, `drupal.ts`, `menu-utils.ts`) — fetch JSON:API,
  transform to normalized types, render.

## Prerequisites

- The Drupal backend running as the `d11-nextjs-be` DDEV project (see [`../drupal`](../drupal)).
  This front end reaches it over the shared DDEV router; server-side fetches are routed by
  `.ddev/docker-compose.backend.yaml`.
- DDEV, or Node 22+ to run it directly without DDEV.

## Environment variables

Configure these per environment. Locally, copy `.env.example` to `.env.local` (`ddev init` does
this for you); on Pantheon, set them as **Pantheon Secrets** (the Drupal installer's *Configure
front end* step generates a ready-to-paste block).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | Drupal backend URL, used in the browser and for server-side fetches. |
| `NEXT_IMAGE_DOMAIN` | Drupal host allowed for `next/image` (host only, no scheme). |
| `DRUPAL_CLIENT_ID` | Simple OAuth consumer client id — typically `default_consumer`. |
| `DRUPAL_CLIENT_SECRET` | Consumer secret used for authenticated calls / draft preview. **Secret** — store in Pantheon Secrets. |
| `DRUPAL_REVALIDATE_SECRET` | Shared secret for on-demand revalidation; must match the Drupal `next_site`. **Secret.** |
| `DRUPAL_PREVIEW_SECRET` | Shared secret for draft mode; must match the Drupal `next_site` preview secret. **Secret.** |

Site name, description, and social links come from `config.json`, bundled at build time.

## Run with DDEV

```bash
ddev init                 # start, seed .env.local, npm install, start the dev server
ddev develop              # run the dev server in tmux (Ctrl-b then d to detach)
ddev develop --background # or start it detached
ddev develop-stop         # stop it
```

The site is served at `https://d11-nextjs-fe.ddev.site` once it finishes compiling. Start the
Drupal backend first (`cd ../drupal && ddev init`) — the front end fetches from it.

## Run without DDEV

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` first and point the Drupal URLs at your backend. The dev
server runs at `http://localhost:3000`.

## How it renders Drupal content

- Fetches content over **JSON:API** from the backend (`/jsonapi/node/*`).
- Builds navigation from the Drupal `nextjs` menu via the **linkset endpoint**
  (`/system/menu/nextjs/linkset`).
- Supports draft preview of unpublished content via `/api/draft`, and on-demand revalidation
  via `/api/revalidate`.

Content types: Pages (`/[...slug]` by path alias), Articles (`/posts/[slug]`), Events
(`/events/[slug]`), and Tags (`/tags`).

## Pantheon Front-End Sites

This app is configured to deploy as a Pantheon Front-End Site:

- **`output: 'standalone'`** in `next.config.ts` — the container build Pantheon runs.
- **`cacheHandler.ts`** + `@pantheon-systems/nextjs-cache-handler` wire Pantheon's persistent
  cache (auto-detects Google Cloud Storage on the platform, file cache locally).
- **`engines.node: 22.x`** in `package.json` pins the platform Node version.

Point a Front-End Site at this repo, set the environment variables above as Pantheon Secrets, and
build/deploy — `next build` produces the standalone server Pantheon serves with `next start`.
