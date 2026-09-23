# Next.js front end

A Next.js 16 front end for the decoupled Drupal + Next.js starter. It renders content over
JSON:API from the Drupal 11 backend — a separate repository,
[`pantheon-upstreams/demo-nextjs-drupal-backend`](https://github.com/pantheon-upstreams/demo-nextjs-drupal-backend) —
and deploys as a **Next.js site on Pantheon**.

**Full setup, usage, and deploy:** see **[GUIDEBOOK.md](GUIDEBOOK.md)** (ships identically in
the backend and front-end repos).

## Stack

- Next.js 16 (App Router) with React 19 and Tailwind CSS 4.
- Its own DDEV project, `d11-nextjs-fe` (generic type, Node 22), reverse-proxied to
  `https://d11-nextjs-fe.ddev.site`.
- Data layer in `src/lib` (`drupal-fetch.ts`, `drupal.ts`, `menu-utils.ts`) — fetch JSON:API,
  transform to normalized types, render.

## Prerequisites

- The Drupal backend running as the `d11-nextjs-be` DDEV project (its own repo). This front
  end reaches it over the shared DDEV router; server-side fetches are routed by
  `.ddev/docker-compose.backend.yaml`.
- DDEV, or Node 22+ to run it directly without DDEV.

## Environment variables

Configure these per environment. Locally, copy `.env.example` to `.env.local` (`ddev init` does
this for you); on Pantheon, set them as **Pantheon Secrets**
(`terminus secret:site:set <fe-site> <KEY> "<value>" --type=env`) — the Drupal installer's
*Configure front end* step also generates a ready-to-paste block.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | Drupal backend URL, used in the browser and for server-side fetches. |
| `NEXT_IMAGE_DOMAIN` | Drupal host allowed for `next/image` (host only, no scheme). |
| `DRUPAL_CLIENT_ID` | Simple OAuth consumer client id — typically `default_consumer`. |
| `DRUPAL_CLIENT_SECRET` | Consumer secret used for authenticated calls / draft preview. **Secret** — store in Pantheon Secrets. |
| `DRUPAL_REVALIDATE_SECRET` | Shared secret for on-demand revalidation; must match the Drupal `next_site`. **Secret.** |
| `DRUPAL_PREVIEW_SECRET` | Not read by the front end — Drupal signs and validates preview links itself. The installer still prints it. |

Site name, description, and social links come from `config.json`, bundled at build time.

## Run with DDEV

```bash
ddev init                 # start, seed .env.local, npm install, start the dev server
ddev develop              # run the dev server in tmux (Ctrl-b then d to detach)
ddev develop --background # or start it detached
ddev develop-stop         # stop it
```

The site is served at `https://d11-nextjs-fe.ddev.site` once it finishes compiling. Start the
Drupal backend first (`ddev init` in the backend repo) — the front end fetches from it.

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

## Next.js on Pantheon

This app is configured for [Next.js hosting on Pantheon](https://docs.pantheon.io/nextjs):

- **`output: 'standalone'`** in `next.config.ts` — the container build Pantheon runs.
- **`cache-handler.mjs`** + `@pantheon-systems/nextjs-cache-handler` wire Pantheon's persistent
  cache (Google Cloud Storage on the platform, a file cache locally).
- **`engines.node: 22.x`** in `package.json` pins the platform Node version.

Create a Next.js site pointed at this repository, set the environment variables above as
Pantheon Secrets, and push — Pantheon builds on every push, and a pull request gets its own
[Multidev environment](https://docs.pantheon.io/nextjs/multidev).

Getting started end to end is covered in
[Drupal + Next.js Quick Start](https://docs.pantheon.io/nextjs/drupal-quickstart).

> Running on the older Front-End Sites offering? See
> [Migrating from Front-End Sites](https://docs.pantheon.io/nextjs/migrating-from-front-end-sites).
