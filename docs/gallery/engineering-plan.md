# Emojibrush Public Gallery — Engineering Plan

> Companion to [`product-plan.md`](./product-plan.md). The product plan defines
> what users experience. This plan defines how we build it. If these two
> documents disagree, the product plan wins and this plan gets updated.

## 1. Starting position (what we have today)

A snapshot of the codebase as of this plan, so the implementation steps below stay grounded:

- **Stack:** Next.js 15.2.8 App Router, React 19, TypeScript strict, Zustand 5, CSS Modules.
- **Routing:** App Router only. One page: `/` (`src/app/page.tsx` → `<App>`). No API routes. No middleware. Layout is the only non-client component (metadata-only); the entire `<App>` subtree is `'use client'`.
- **State:** Single Zustand store at `src/store/store.ts`. Shape: `{ painting, tool, palette, showPicker, editPaletteMode, showExpandedToolbar }`. Persisted to `localStorage` under key `emoji-brush`; only `painting`, `tool`, `palette` are persisted (see `partialize`, lines 122–128).
- **Canvas model:** `Painting = { width, height, grid: string[][] }` in `src/types.ts`. The hard-coded landscape lives in `initialPainting` (store.ts:32–48).
- **Rendering:** `src/components/Canvas.tsx` draws emojis on an HTML5 canvas (id `emojibrush-canvas`) at 2× retina, 32px cells, sans-serif font. `Download.tsx` calls `canvas.toDataURL()` directly off that DOM node.
- **Tooling:** Jest + ts-jest (node env), Prettier, ESLint (next config), Husky pre-commit running lint-staged. No CI workflow yet (README TODO).
- **Hosting:** Vercel. `@vercel/analytics` and `@vercel/speed-insights` are wired in `layout.tsx`. PWA manifest exists. No `vercel.json`, no `.env*` in repo.

Nothing on the server today. Adding the gallery means introducing a server layer (DB, auth, blob storage) for the first time.

---

## 2. Architectural shape

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │ Editor (client, '/')       │  │ Gallery / Art / Profile    │  │
│  │ - Zustand store            │  │ (server-rendered pages     │  │
│  │ - localStorage canvas      │  │  with small client islands │  │
│  │ - calls publish action     │  │  for like buttons, etc.)   │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
└─────────────────┬──────────────────────────────┬─────────────────┘
                  │ Server Actions / Route Handlers
                  ▼                              ▼
        ┌──────────────────────────────────────────────┐
        │  Next.js server (Vercel functions)            │
        │  - Auth.js v5 (session)                       │
        │  - Drizzle ORM → Postgres                     │
        │  - Vercel Blob (thumbnails)                   │
        └──────────────────────────────────────────────┘
```

**Principles driving the shape:**

1. **The editor stays a client app.** Zustand + localStorage is keeping working state, and we don't want to regress its offline-first feel. Server entry points are only hit on publish/like/remix.
2. **Gallery pages are server-rendered Server Components.** They need SEO, OpenGraph cards, fast first paint. They read straight from the DB; no client data fetching.
3. **Small client islands inside server pages** for interactive bits (like button, tabs). Keep them well-isolated.
4. **Server Actions over hand-rolled API routes** wherever possible. The few real endpoints we expose (auth callbacks, sitemap, thumbnail) get route handlers.

---

## 3. Stack decisions (with alternatives)

These are the choices that need approval before any code is written. The recommendation column is what this plan otherwise assumes. If we pick differently, sections below need adjustment.

| Concern         | Recommendation                              | Alternatives considered                                          |
|-----------------|---------------------------------------------|------------------------------------------------------------------|
| **Auth**        | Auth.js v5 (NextAuth) with email magic link + GitHub provider | Clerk (faster, costlier, more vendor lock-in); Supabase Auth (only if we choose Supabase for DB) |
| **Database**    | Neon (serverless Postgres) on Vercel        | Supabase Postgres; Turso (SQLite); Vercel Postgres (now Neon-backed anyway) |
| **ORM**         | Drizzle ORM                                  | Prisma (heavier cold start on serverless); raw SQL via `postgres` |
| **Blob storage**| Vercel Blob                                  | Cloudflare R2; Supabase Storage                                  |
| **Email (magic link)** | Resend                                | Postmark; SES                                                    |
| **Validation**  | Zod                                          | Valibot                                                          |

**Why this combination:** all Vercel-native, no new vendor accounts beyond Neon+Resend (both have generous free tiers), keeps cold-start latency low, and Drizzle's schema-as-TS keeps the data model in the same file tree as the rest of our code. NextAuth + Drizzle has a first-class adapter.

> **Decision required:** pick the stack (or accept the recommendation) before starting Phase A below.

---

## 4. Data model

Schema lives in `src/server/db/schema.ts` (Drizzle). Tables:

### `users`
| column        | type            | notes                                          |
|---------------|-----------------|------------------------------------------------|
| `id`          | uuid pk         | Auth.js identity                               |
| `handle`      | citext unique   | lowercase, `[a-z0-9_]{3,20}`, claimed at first publish or on a one-time setup screen |
| `display_name`| text            | free-form, ≤ 40 chars                          |
| `avatar_emoji`| text            | single emoji string; default randomized        |
| `email`       | citext unique   | from Auth.js                                   |
| `created_at`  | timestamptz     | default now                                    |

Auth.js's own tables (`accounts`, `sessions`, `verification_tokens`) live alongside via the Drizzle adapter — generated, not hand-edited.

### `artworks`
| column         | type          | notes                                            |
|----------------|---------------|--------------------------------------------------|
| `id`           | text pk       | short URL-safe id (e.g. nanoid 10 chars)         |
| `author_id`    | uuid fk → users.id |                                              |
| `width`        | int           | matches `Painting.width`                         |
| `height`       | int           | matches `Painting.height`                        |
| `grid`         | jsonb         | the `string[][]` itself; canonical source       |
| `thumbnail_url`| text          | Vercel Blob URL of the published PNG             |
| `remix_of_id`  | text fk → artworks.id, nullable | lineage to parent              |
| `featured`     | boolean default false | curated pool flag (admin-toggled)         |
| `like_count`   | int default 0 | denormalized; trigger or app-level updated       |
| `created_at`   | timestamptz   | default now                                      |
| `deleted_at`   | timestamptz nullable | soft-delete for moderation                |

Indexes: `(created_at desc)` for Recent, `(like_count desc, created_at desc)` for Popular's first pass, `(author_id, created_at desc)` for profile pages, partial index `featured = true` for the curated pool.

### `likes`
| column        | type          | notes                                            |
|---------------|---------------|--------------------------------------------------|
| `user_id`     | uuid fk → users.id |                                             |
| `artwork_id`  | text fk → artworks.id |                                          |
| `created_at`  | timestamptz   | default now                                      |
| pk            | (`user_id`, `artwork_id`) |                                       |

`like_count` updated transactionally with insert/delete (app-level, not trigger — keeps the schema portable).

### Future / deferred
- `reports` table for the moderation gap. Stub it out with `id, artwork_id, reporter_id?, reason, created_at, resolved_at` but don't build admin UI in v1.
- `featured_curators` (only the user marked `is_admin = true` can set `featured`). For v1, `is_admin` is a hand-toggled column on `users`; no UI.

### Popularity ranking

For v1, "Popular" tab sorts by:

```
score = like_count / pow(hours_since_post + 2, 1.8)
```

Computed in the query (no separate column needed). Standard Hacker News-style decay. Cheap; revisit if it stops feeling right.

---

## 5. Surface area: routes & actions

### Pages (Server Components unless noted)

| Path              | Renders                                      | Auth needed     |
|-------------------|----------------------------------------------|------------------|
| `/`               | Editor (`'use client'` subtree, unchanged)  | No               |
| `/gallery`        | Tabbed feed (Recent default)                | No               |
| `/gallery?tab=popular` | Popular tab                            | No               |
| `/art/[id]`       | Artwork detail                              | No (like requires sign-in) |
| `/u/[handle]`     | Public profile                              | No               |
| `/signin`         | Auth.js sign-in UI                          | No               |
| `/settings`       | Profile + account settings                  | Yes              |
| `/api/auth/[...nextauth]` | Auth.js handler                     | n/a              |
| `/api/og/art/[id]` | Dynamic OG image (returns thumbnail)       | No               |
| `/sitemap.xml`    | Recent published pieces                     | No               |
| `/robots.txt`     | Standard                                    | No               |

### Server Actions (preferred over API routes)

| Action                         | Where called             | Auth     | Returns                  |
|--------------------------------|--------------------------|----------|--------------------------|
| `publishArtwork(grid, width, height, remixOfId?, thumbnailDataUrl)` | Editor Publish button | Required | `{ id }`                 |
| `deleteArtwork(id)`            | Detail page / Profile    | Required (owner) | `void`            |
| `toggleLike(artworkId)`        | Like button (client island) | Required | `{ liked, likeCount }` |
| `updateProfile({ handle?, displayName?, avatarEmoji? })` | Settings | Required | `{ ok }`                 |
| `deleteAccount()`              | Settings                 | Required | `void`                   |
| `claimHandle(handle)`          | Post-signup gate         | Required (no handle yet) | `{ ok }`        |

### Route handlers (HTTP)

Only for things that genuinely need HTTP semantics:

- `GET /api/featured/random` — returns a random featured artwork's grid + author. Cached at the edge for ~60s. Used by the editor's first-visit hydration.
- `GET /api/og/art/[id]` — serves the artwork's thumbnail with OG-safe headers.
- `GET /sitemap.xml` — straightforward.

---

## 6. The editor changes

These changes layer onto the existing client tree without rewriting it.

### Store additions (`src/store/store.ts`)

Add to the `Store` interface:

```ts
remixOf: {
  artworkId: string
  authorHandle: string
  authorAvatar: string  // emoji
} | null
setRemixOf: (remixOf: Store['remixOf']) => void
clearCanvas: () => void   // resets grid to blank, clears remixOf
```

Add to `partialize` so `remixOf` survives a reload:

```ts
partialize: (state) => ({
  painting: state.painting,
  tool: state.tool,
  palette: state.palette,
  remixOf: state.remixOf,
}),
```

`resetPainting` keeps today's behavior (clears grid). The new `clearCanvas` clears grid *and* `remixOf` and is what the **Start fresh** CTA calls.

### First-time visitor hydration

A new client component `<FirstVisitGate>` mounts inside `<App>`. On mount:

1. Read Zustand `painting.grid` (already hydrated from localStorage by the persist middleware).
2. If the grid equals the legacy hard-coded landscape *and* `remixOf` is null, treat the visitor as first-time:
   - `fetch('/api/featured/random')` → `{ id, grid, width, height, authorHandle, authorAvatar }`.
   - Call `setPainting({ grid, width, height })` and `setRemixOf({ artworkId, authorHandle, authorAvatar })`.
3. Otherwise: no-op.

> **Note on detecting first visit:** "no `emoji-brush` key in localStorage" is the right signal but Zustand's persist middleware writes the key on first render, so we either (a) check before the store hydrates by reading `localStorage` directly in the gate, or (b) treat "grid still equals the seed landscape and `remixOf` is null" as the signal. (b) is simpler and degrades gracefully even for visitors who hit the editor before this code shipped. Go with (b) and retire the hard-coded landscape once the featured pool is populated.

### Remixing-mode UI

A new component `<RemixChip>` lives near the Header. Visible whenever `remixOf !== null`. Renders:

```
Remixing by @{authorHandle} {authorAvatar}  ·  View more in the gallery  ·  Start fresh
```

- "@handle" links to `/u/{handle}`.
- "View more in the gallery" links to `/gallery`.
- "Start fresh" calls `clearCanvas()`.

### Publish button

New `<Publish>` component, added inside the existing `<Share>` toolbar section, alongside Copy and Download. Behavior:

1. If not signed in → `router.push('/signin?next=/?intent=publish')`. The signin page reads `next` and bounces back here. Editor re-mounts, sees `?intent=publish` and `session`, kicks off the publish flow.
2. Generate a thumbnail PNG **client-side** from the live canvas:
   ```ts
   const canvas = document.getElementById('emojibrush-canvas') as HTMLCanvasElement
   const dataUrl = canvas.toDataURL('image/png')
   ```
   This is identical to the existing Download logic — reuse it. Limit thumbnail size by drawing into an offscreen canvas at a fixed 480×480 cap if the artwork is huge.
3. Call the `publishArtwork` Server Action with `{ grid, width, height, remixOfId, thumbnailDataUrl }`.
4. On success: show a toast/inline confirmation with the permalink (`/art/{id}`), copy-to-clipboard button, and a link to the gallery. Clear `remixOf` so the next publish is a fresh piece.

> **Why client-side thumbnails:** the canvas already renders emojis perfectly because the user's OS provides the emoji font. Server-side PNG generation would require a headless browser or shipping an emoji font — far more complexity for no visible win. Cost of trust: the client could upload an arbitrary PNG, but the canonical data is the grid; the thumbnail is purely a cache. We can regenerate it server-side later if it becomes an attack vector.

### Destructive-load confirmation

When the editor receives `?remix={id}` in the URL (used by the Remix button on `/art/[id]`):

1. If `painting.grid` differs from `initialPainting.grid` AND `remixOf` is null (i.e. the user has touched the canvas with their own work) → show a modal: *"Your current drawing will be replaced. Continue?"* with "Cancel" / "Download first" / "Continue".
2. Otherwise (the canvas is the seed landscape or already-in-remix work) → load directly.
3. On confirm: fetch the artwork by id (server-rendered, but the editor reads it via a small `/api/artwork/[id]` route handler returning just `grid, width, height, author`), call `setPainting` + `setRemixOf`.

---

## 7. The gallery surface

### `/gallery`

Server Component. Reads from the DB with Drizzle. Renders a tab strip (Recent / Popular) and an `<ArtworkGrid>` of cards.

`<ArtworkCard>` shows the **thumbnail PNG** (not a re-rendered grid) — same emoji parity as the original author saw, no font drift across devices. Author chip + like count below.

Pagination: cursor-based (`?cursor=<createdAt>` for Recent, `?cursor=<score>:<id>` for Popular). Page size 24. "Load more" is a small client island that appends via a Server Action.

### `/art/[id]`

Server Component. Renders:

- A re-rendered grid (client island using the same `<Canvas>` logic, but read-only) at full size. This gives sharper rendering than the thumbnail, and the thumbnail acts as a placeholder before hydration.
- Author chip, publish date, like count + like button (client island), Remix button (links to `/?remix=<id>`), copy/download buttons (reuse editor utilities), "Remixed from" breadcrumb if applicable, owner-only delete button.
- OG metadata via `generateMetadata`: title `"{handle}'s emoji art"`, image `/api/og/art/[id]`.

### `/u/[handle]`

Server Component. Same `<ArtworkGrid>` filtered by `author_id`. Profile header with avatar emoji, display name, handle, member-since.

### `/signin`

Auth.js's default sign-in UI is fine for v1. Style it lightly to match. After successful sign-in, if the user has no `handle`, redirect to `/settings?onboarding=1`; otherwise honor `?next=`.

### `/settings`

Server Component shell + client form. Edit handle (one-time-ish: allow change, but warn), display name, avatar emoji. Buttons: sign out, delete account (confirmation modal).

---

## 8. Auth flow specifics

- **Providers:** email magic link (Resend) + GitHub OAuth. Two is enough to start.
- **Sessions:** database sessions (not JWT) — needed for `deleteAccount` to revoke instantly, and keeps the user model simple.
- **Handle claim:** required to publish. If a signed-in user without a handle hits Publish, redirect to `/settings?onboarding=1&next=...` first.
- **Middleware:** a thin `middleware.ts` matching `/settings` only, redirecting unauthenticated → `/signin`. Everything else stays public.
- **CSRF / origin checks:** Auth.js handles for auth endpoints; Server Actions get Next.js's built-in protection.

---

## 9. PWA, caching, SEO

- **Manifest:** update the existing `manifest.ts` start_url scope is fine as `/`. No changes.
- **Service worker:** the project doesn't have a custom SW (just the manifest); adding gallery routes doesn't change anything.
- **Static caching:** gallery list pages get `revalidate = 60`. Detail pages get `revalidate = 300`. Author pages `revalidate = 60`. All can be revalidated on-write via `revalidateTag`.
- **OpenGraph / Twitter card:** every `/art/[id]` page sets OG image to its thumbnail URL. This is the main link-share surface, so getting it right matters.
- **Sitemap:** weekly background regen of `/sitemap.xml` from the most recent N artworks (cap at 5000 for v1).
- **`metadataBase`:** today hard-coded to `https://emojibru.sh` with a TODO comment. Switch to `process.env.NEXT_PUBLIC_SITE_URL` and set per-environment.

---

## 10. Configuration & env

New required env vars (added to `.env.example`, real values in Vercel):

```
DATABASE_URL=                  # Neon pooled connection
DATABASE_URL_UNPOOLED=         # for migrations
AUTH_SECRET=                   # NextAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_RESEND_KEY=
BLOB_READ_WRITE_TOKEN=         # Vercel Blob
NEXT_PUBLIC_SITE_URL=          # https://emojibru.sh or preview URL
```

Drizzle migration directory: `drizzle/`. Use `drizzle-kit generate` locally, commit migrations, run `drizzle-kit migrate` in a Vercel build hook.

---

## 11. Migration & rollout

There's no data to migrate (no users, no published pieces yet). The legacy hard-coded landscape becomes the *seed* of the featured pool:

1. Manually create a system "emojibrush" user account post-deploy.
2. Publish the legacy landscape and a small handful of new curated pieces under that account.
3. Mark them `featured = true`.
4. Once the featured pool has ≥ 3 pieces, remove the hard-coded `initialPainting` landscape from `store.ts` (or keep it as a true blank-canvas fallback only).

Until then, the first-time visitor flow falls back to the existing hard-coded landscape if `/api/featured/random` returns nothing.

---

## 12. Testing

Existing Jest setup (`testEnvironment: 'node'`) won't cover most new code well. Add:

- **Unit tests** for store reducers (`setRemixOf`, `clearCanvas`, publish-clears-remix) and any pure utilities. Keep using Jest.
- **Server Action tests** via Jest with a test Postgres (Neon branch per CI run) and Drizzle. Cover: publish-creates-row, like-toggle-atomic, delete-owner-only, handle-uniqueness.
- **Component tests** for new client islands (`<RemixChip>`, `<LikeButton>`, `<Publish>`) using React Testing Library + jsdom. Add a second Jest project with `testEnvironment: 'jsdom'` for these.
- **E2E** for the three product acceptance flows (first-time visitor, returning creator, lurker). Playwright. New script `npm run test:e2e`. Runs against `next start` with a seeded DB. Probably the single most valuable test surface.
- **CI**: add `.github/workflows/ci.yml` to run `lint`, `test`, build, and Playwright. The README has a long-standing "add CI" TODO; this is the moment.

---

## 13. Risks & open questions

- **Emoji font drift in thumbnails.** Client-side PNGs reflect the publishing device's emoji font. Same artwork published from iOS vs. Android will look different in the gallery thumbnail. Acceptable for v1; flag if it becomes confusing.
- **Like denormalization races.** `like_count` updated app-side means two simultaneous likes could under-count if we're sloppy. Mitigation: do `UPDATE artworks SET like_count = like_count + 1` rather than read-then-write. Drizzle supports this.
- **Featured pool empty at launch.** Ship behind a feature flag (`FEATURE_GALLERY=true`) and only flip when we've seeded ≥ 3 featured pieces.
- **Auth.js v5 + Next 15 maturity.** v5 is GA but adapter docs lag. Budget time for adapter glue.
- **Service Worker / PWA.** Cached pages might serve stale gallery content. Confirm the manifest-only setup doesn't actually register a SW (a quick check in DevTools); if it does, gallery routes need exemption.
- **Mobile publish UX.** The toolbar is already cramped on mobile. The Publish button needs to live somewhere that doesn't push other controls offscreen. Mobile-first design decision required before the Publish PR lands.
- **`metadataBase` env handling.** Already flagged in `layout.tsx:9` as a TODO; we're fixing it here, but make sure preview deployments don't accidentally claim the canonical URL.

---

## 14. Phasing

Five PRs, each independently shippable. The feature flag `FEATURE_GALLERY` (read at build time) hides UI entry points until each phase is ready.

### Phase A — Foundation (no user-visible changes)
- Drizzle schema, migrations, Neon connection.
- Auth.js v5 + adapters; sign-in works; `/signin` and `/settings` exist but unlinked.
- `.env.example`, Vercel env vars, CI workflow stub.
- **Verification:** can sign in locally, can claim a handle, row appears in `users`.

### Phase B — Publish flow
- `publishArtwork` Server Action; Vercel Blob upload of client-generated thumbnail.
- `<Publish>` button in editor toolbar (hidden behind `FEATURE_GALLERY` flag).
- `/art/[id]` page (read-only) renders a published piece.
- **Verification:** sign in → publish → land on `/art/[id]` showing the piece.

### Phase C — Browse + profiles
- `/gallery` with Recent and Popular tabs, cursor pagination.
- `/u/[handle]` profile page.
- Server Action + island for likes; `like_count` denormalized.
- Delete-own-artwork.
- **Verification:** publish 3 pieces from 2 accounts, both tabs work, likes count, profile lists own work.

### Phase D — Remix + first-time visitor
- `remixOf` added to Zustand store and persistence.
- `<RemixChip>` UI in editor.
- `/?remix=<id>` URL handler + destructive-load modal.
- `<FirstVisitGate>` + `/api/featured/random` + featured pool seeded manually.
- **Verification:** the three product acceptance flows in the product plan all pass (manually + as Playwright tests).

### Phase E — Polish & launch
- OG images for `/art/[id]`.
- Sitemap.
- Report-piece stub (email link is fine for v1).
- Mobile Publish UX final pass.
- Flip `FEATURE_GALLERY` on.
- **Verification:** lighthouse passes, social card previews well, mobile editor still ergonomic.

---

## 15. Files this plan will touch (approximate)

### New
- `docs/gallery/engineering-plan.md` (this file)
- `src/server/db/schema.ts`, `src/server/db/client.ts`, `drizzle.config.ts`, `drizzle/*.sql`
- `src/server/auth.ts`, `src/middleware.ts`
- `src/server/actions/{publishArtwork,toggleLike,deleteArtwork,updateProfile,deleteAccount,claimHandle}.ts`
- `src/server/queries/{listRecent,listPopular,getArtwork,getProfile,randomFeatured}.ts`
- `src/server/blob.ts` (thumbnail upload helper)
- `src/app/gallery/page.tsx`, `src/app/art/[id]/page.tsx`, `src/app/u/[handle]/page.tsx`, `src/app/signin/page.tsx`, `src/app/settings/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/featured/random/route.ts`, `src/app/api/og/art/[id]/route.ts`, `src/app/api/artwork/[id]/route.ts` (read-only minimal grid)
- `src/app/sitemap.ts`
- `src/components/gallery/{ArtworkGrid,ArtworkCard,LikeButton,Tabs,LoadMore}.tsx` + CSS modules
- `src/components/editor/{Publish,RemixChip,FirstVisitGate,RemixLoadModal}.tsx`
- `.github/workflows/ci.yml`, `.env.example`, `playwright.config.ts`, `e2e/*.spec.ts`

### Modified
- `src/store/store.ts` (add `remixOf`, `clearCanvas`, update `partialize`)
- `src/components/App.tsx` (mount FirstVisitGate + RemixChip)
- `src/components/Header.tsx` (Gallery link + account state)
- `src/components/Share.tsx` (insert Publish button)
- `src/app/layout.tsx` (env-driven `metadataBase`)
- `README.md` (gallery section, env vars, run instructions)
- `package.json` (deps + scripts: drizzle-kit, playwright, auth.js, etc.)

### Untouched
- `src/utils/fill.ts`, `src/components/Canvas.tsx`, `src/components/Artboard.tsx`, palette/tool/resize/help components. The editor's core logic does not change.

---

## 16. Definition of done (engineering-level)

In addition to the product plan's three acceptance flows:

- [ ] All env vars documented in `.env.example` and set in Vercel (prod + preview).
- [ ] Drizzle migrations run automatically in Vercel build; rollback procedure documented.
- [ ] CI green on lint, unit, integration, e2e.
- [ ] No localhost-only assumptions left in code (`NEXT_PUBLIC_SITE_URL` resolves correctly on previews).
- [ ] Lighthouse: gallery list and detail pages > 90 performance on mobile.
- [ ] `like_count` cannot drift from real likes under concurrent toggles (covered by integration test).
- [ ] Deleted artworks are unreachable from any public surface within one cache cycle (verified by test).
- [ ] At least 3 featured artworks seeded before `FEATURE_GALLERY` flips on.
- [ ] README updated with how to run the full stack locally.

---

## Decisions still needed before Phase A starts

1. **Stack confirmation** (Section 3). Approve recommendation or substitute.
2. **Auth providers**: GitHub + email magic link — or different set?
3. **Domain**: keep `emojibru.sh` as canonical, or new gallery-aware domain? (Affects OG, sitemap, cookies.)
4. **Admin identity for the system "emojibrush" curator account**: which email seeds it?

Everything else in this plan can move forward as written once those four are answered.
