# Backend design: users, galleries, and a public feed on atproto

> Status: **Proposal / exploration** — no application code has been written yet.
> Author: design spike. Date: 2026-06-06.

This document explores how to add a backend to **emojibru.sh** so that people can
sign in, save multiple paintings into personal **galleries**, and browse a
network-wide **public feed** — built on the **AT Protocol (atproto)**, the same
foundation that [Tangled](https://tangled.org/) is built on.

---

## 1. Where the app is today

emojibru.sh is currently a **100% client-side** application. There is no server,
no database, and no concept of an account.

- **Stack:** Next.js 15 (App Router) + React 19, deployed on Vercel.
- **State:** a single `Painting` (`{ width, height, grid: string[][] }`, see
  `src/types.ts`) held in a Zustand store and persisted to `localStorage` under
  the key `emoji-brush` (`src/store/store.ts`).
- **Sharing:** `src/components/Share.tsx` only offers **Copy to clipboard**
  (emoji text) and **Download** (image). Nothing leaves the device.
- **Limitation:** the store models exactly **one** painting. There is no notion
  of a saved collection, an author, or anything shared between users.

Adding "users, galleries, and a public feed" therefore introduces three brand
new capabilities: **identity**, **persistent multi-painting storage per user**,
and a **network-wide aggregated view**.

---

## 2. Why atproto / "leveraging Tangled"

[Tangled](https://tangled.org/) is a **git collaboration platform** (a
decentralized GitHub alternative). It hosts *git repositories*, so we cannot
literally store emoji art inside it. What is reusable is **the AT Protocol that
Tangled is built on**, and **Tangled's architecture pattern**, which maps cleanly
onto what we want:

| Tangled concept | atproto primitive | emojibru.sh equivalent |
| --- | --- | --- |
| Code lives in a **knot** (your own server) | **PDS** (Personal Data Server) holds a user's repo of records | Each painting is a **record in the user's own PDS** |
| **AppView** at tangled.org = one consolidated view of all knots | An **AppView** indexes the firehose into its own DB | **The public feed** = our AppView indexing paintings network-wide |
| Login with your atproto handle | **OAuth** against the user's PDS (DID + handle) | **Users** — no password DB, no user table |

The payoff is the same one Tangled sells:

- **Users own their data.** Paintings live in the user's own repository/PDS, not
  in our database. We only keep a derived index.
- **Portable, password-less identity.** Sign in with an existing atproto handle
  (e.g. a Bluesky `*.bsky.social` handle). We never store credentials.
- **Federation for free.** Anyone running our lexicon anywhere shows up in the
  feed.

> **Trade-off, stated up front:** atproto is the harder path. We take on OAuth
> complexity, a custom lexicon, and **one always-on service** (the
> firehose/Jetstream → Postgres indexer) that does not fit Vercel's serverless
> model. A conventional backend (Postgres + an auth provider) would ship faster
> but loses the decentralization story. This document commits to the atproto
> approach per the project decision.

---

## 3. Target architecture

```
┌──────────────────────┐   1. OAuth login        ┌───────────────────────────┐
│  emojibru.sh         │ ──────────────────────▶ │  User's PDS               │
│  (Next.js on Vercel) │   3. createRecord       │  (bsky.social or self-host)│
│                      │ ──────────────────────▶ │  repo: sh.emojibru.painting│
│  - paint canvas      │   4. listRecords        │  repo: sh.emojibru.gallery │
│  - "Save" button     │ ◀────────────────────── └─────────────┬─────────────┘
│  - "My galleries"    │                                       │ firehose
│  - "Public feed"     │   5. feed/gallery API                 ▼
└──────────┬───────────┘ ◀───────────────┐       ┌───────────────────────────┐
           │                             └───────│  AppView (our backend)    │
           │  2. /client-metadata.json           │  - Jetstream consumer (WS)│
           └────────────────────────────────────▶│  - Postgres index         │
                                                  │  - REST: /feed, /gallery  │
                                                  └───────────────────────────┘
```

**Data ownership boundary:** everything to the *right of the PDS* (the AppView's
Postgres) is a **disposable, rebuildable cache**. The source of truth is each
user's PDS. If our index is wiped, we can replay the firehose and rebuild it.

### Components

1. **The Next.js app (unchanged hosting).** Stays on Vercel. Gains: an auth flow,
   a "Save to gallery" action, a galleries view, and a feed view. Talks directly
   to the user's PDS for writes/reads of *their own* data, and to our AppView for
   the *global* feed.

2. **The user's PDS.** Not ours to run — it is wherever the user's atproto
   identity lives (Bluesky's `bsky.social`, or a self-hosted PDS). We write
   painting records here via `com.atproto.repo.createRecord`.

3. **The AppView (new infrastructure).** A small, always-on service that:
   - subscribes to **Jetstream** (the JSON firehose) filtered to our lexicon
     collections,
   - upserts painting + gallery records into **Postgres**,
   - serves a read-only REST/JSON API for the global feed and for browsing any
     user's public gallery by handle.

   This is the only piece that cannot run on Vercel functions (it needs a
   persistent websocket and a long-lived process). Target: a single small
   container/VM (Fly.io, Railway, a cheap VPS, or a Raspberry Pi — mirroring
   Tangled's "run your own knot" ethos).

---

## 4. Data model (custom lexicon)

atproto schemas are **Lexicons** — JSON-Schema-like definitions with
reverse-DNS-namespaced IDs that signal ownership. We would own the
`sh.emojibru.*` namespace (matching the `emojibru.sh` domain).

> Note: `grid` is stored **flattened** (row-major) with explicit `width`/`height`
> rather than a nested array, because atproto Lexicon arrays of arrays are
> awkward and flattening keeps records compact and easy to validate. The client
> reshapes it back to `string[][]` on load.

### `sh.emojibru.painting`

`lexicons/sh/emojibru/painting.json`

```jsonc
{
  "lexicon": 1,
  "id": "sh.emojibru.painting",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["grid", "width", "height", "createdAt"],
        "properties": {
          "title":     { "type": "string", "maxLength": 140 },
          "width":     { "type": "integer", "minimum": 1, "maximum": 64 },
          "height":    { "type": "integer", "minimum": 1, "maximum": 64 },
          "grid": {
            "type": "array",
            "description": "Row-major flattened cells; length must equal width*height.",
            "items": { "type": "string", "maxGraphemes": 8 }
          },
          "thumbnail": { "type": "blob", "accept": ["image/png"], "maxSize": 1000000 },
          "createdAt": { "type": "string", "format": "datetime" }
        }
      }
    }
  }
}
```

A painting is tiny JSON (a 64×64 grid of short emoji strings is only a few KB),
so it fits comfortably within atproto record size limits. The **thumbnail** is a
rendered PNG uploaded as a separate **blob** so the feed/gallery can show
previews without reconstructing each grid.

### `sh.emojibru.gallery` (optional, phase 2+)

A user's gallery is, by default, *just the set of `sh.emojibru.painting` records
in their repo*. If we want **named, ordered** collections, add a gallery record
that references paintings by their AT-URI / CID (a "strong ref"):

```jsonc
{
  "lexicon": 1,
  "id": "sh.emojibru.gallery",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["name", "createdAt"],
        "properties": {
          "name":        { "type": "string", "maxLength": 80 },
          "description": { "type": "string", "maxLength": 500 },
          "items": {
            "type": "array",
            "maxLength": 200,
            "items": {
              "type": "ref",
              "ref": "com.atproto.repo.strongRef"
            }
          },
          "createdAt":   { "type": "string", "format": "datetime" }
        }
      }
    }
  }
}
```

---

## 5. The three capabilities, concretely

### 5.1 Users — atproto OAuth

- Library: [`@atproto/oauth-client-browser`](https://www.npmjs.com/package/@atproto/oauth-client-browser)
  for an SPA-style flow, or `@atproto/oauth-client-node` driven through Next.js
  route handlers if we want server-held sessions.
- Flow: user types their **handle** → we resolve their DID and PDS → redirect
  through OAuth → receive an `OAuthSession` used to sign requests to *their* PDS.
- We publish a **`client-metadata.json`** (served by the Next.js app, e.g.
  `/oauth/client-metadata.json`) describing our client, redirect URIs, and
  requested scopes.
- **No user table, no passwords.** The "user" is their DID + handle.

### 5.2 Galleries — write/read records in the user's PDS

- **Save:** extend `src/components/Share.tsx` with a "Save to my gallery" action.
  It renders the current `Painting`, produces a PNG thumbnail (reuse the existing
  Download rendering path), uploads the blob, then calls
  `com.atproto.repo.createRecord` with collection `sh.emojibru.painting`.
- **List my paintings:** `com.atproto.repo.listRecords` over the signed-in user's
  repo.
- **Browse anyone's gallery:** `listRecords` against that user's PDS by handle —
  works even for users who are not signed into our app, because the data is
  public on their PDS.
- **Delete / rename:** `deleteRecord` / `putRecord`.

### 5.3 Public feed — the AppView

- **Ingest:** a long-lived Node/TypeScript process connects to **Jetstream**
  (`wss://jetstream*.us-*.bsky.network/subscribe?wantedCollections=sh.emojibru.painting`),
  receiving create/update/delete events network-wide for our collection(s).
- **Index:** upsert into Postgres tables, e.g.
  - `paintings(uri, cid, did, handle, title, width, height, thumb_url, indexed_at, created_at)`
  - `galleries(uri, cid, did, name, item_uris[], created_at)`
  - plus a `cursor` row so we can resume the stream after a restart.
- **Serve:** a tiny REST API:
  - `GET /feed?limit=&cursor=` → recent paintings across the network.
  - `GET /gallery/:handle` → one user's paintings (can also be served directly
    from the PDS, but the index makes it fast and avoids hammering PDSes).
  - `GET /painting/:uri` → single painting detail.
- The Next.js app fetches these for the feed/gallery pages. Optionally cache at
  the edge since feed data is public.

---

## 6. Phased delivery plan

| Phase | Goal | Touches | Notes |
| --- | --- | --- | --- |
| **0** | **Refactor for multiplicity.** Give paintings an identity/metadata and separate "current canvas" from "saved paintings" in the store. | `src/store/store.ts`, `src/types.ts` | Pure groundwork, independent of atproto; unblocks everything else. |
| **1** | **Auth.** atproto OAuth login, session handling, sign-in/out UI, `client-metadata.json`. | new `src/lib/atproto/`, `src/app/oauth/*`, header UI | Feature-flag it so prod stays unaffected until ready. |
| **2** | **Save + galleries.** Lexicon, PNG-thumbnail render, "Save to gallery", "My galleries" view, browse-by-handle. | `Share.tsx`, new gallery routes, `lexicons/` | Reads/writes go straight to the user's PDS — no AppView needed yet. |
| **3** | **AppView + public feed.** Jetstream consumer, Postgres schema, feed API, feed page, deploy the service. | new `appview/` package, infra | The only always-on infra; deploy off-Vercel. |

Phases 0–2 deliver a usable "sign in and save your art" product with **zero new
servers** (everything rides on the user's PDS). Phase 3 is what turns it social.

---

## 7. Open questions / decisions to make later

1. **Browser vs. server OAuth session** — SPA (`-browser`) is simpler to deploy
   on Vercel; server sessions (`-node`) give more control but need session
   storage.
2. **Gallery model** — implicit ("all my painting records") vs. explicit named
   `sh.emojibru.gallery` collections. Recommend starting implicit (Phase 2),
   adding named galleries only if demanded.
3. **Moderation** — a public feed needs at minimum a denylist and the ability to
   hide records from the index. atproto labeling services are the "proper"
   answer but are heavier; start with a simple AppView-side hide list.
4. **AppView hosting** — Fly.io / Railway / VPS / self-host. Postgres managed
   (Neon/Supabase) vs. on the same box.
5. **Lexicon publication** — whether to formally publish the `sh.emojibru.*`
   lexicons so other clients can interoperate.

---

## 8. Verification note

`docs.tangled.org` and `atproto.com` both returned **HTTP 403** to automated
fetches from the build environment used to write this doc, so the exact field
names, OAuth scopes, and Jetstream URLs above were drawn from web search results
and general atproto knowledge. Before implementation, verify against the live
sources:

- AT Protocol application guide: <https://atproto.com/guides/applications>
- `@atproto/oauth-client`: <https://www.npmjs.com/package/@atproto/oauth-client>
- `@atproto/api` (createRecord/listRecords): <https://github.com/bluesky-social/atproto>
- Jetstream: <https://github.com/bluesky-social/jetstream>
- Tangled docs (reference architecture): <https://docs.tangled.org/>
- Tangled intro / "why atproto": <https://blog.tangled.org/intro/>
