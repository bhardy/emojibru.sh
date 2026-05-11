# Emojibrush Public Gallery — Product Plan (Phase 1: Desired Product)

> This is the durable product spec for the gallery initiative. All future
> product, design, and engineering decisions for the gallery should be
> consistent with what is described here. If a decision contradicts this
> document, update this document first.

## Context

Emojibrush is today a single-page emoji pixel-art editor (Next.js 15 + React 19 + Zustand, fully client-side, one persistent canvas in localStorage, no auth, no backend). It's a complete tool but a dead end socially — there is no way to share a finished piece with anyone, no way to discover what other people have made, and nothing pulling first-time visitors back.

The goal of the gallery is to turn emojibrush from a **standalone tool** into a **lightweight creative community**: a place where people can publish a piece, browse what others have made, react to it, and remix it back into the editor. This phase intentionally describes only the **desired product surface** — what the user experiences. Tech, data model, API, hosting, and migration questions are covered in the companion [engineering plan](./engineering-plan.md).

## Confirmed product decisions

These were settled in the planning conversation and frame everything below:

- **Auth:** Browsing is open to everyone. Publishing, liking, and remixing require a signed-in account.
- **Editor model:** Keep today's single working canvas in localStorage. Publishing is a *snapshot* — the canvas keeps editing independently afterward.
- **Home IA:** Editor stays at `/` (today's home). Gallery is a clearly-linked destination, not the front door.
- **Social scope (v1):** Likes and Remix. No comments, no collections.
- **Publish flow:** One click. No title, description, or tags.
- **Discovery:** Recent feed + Popular/trending tab.
- **Profiles:** Public profile page per user.
- **First-time visitor onboarding:** A new visitor lands in the editor with a *curated* gallery piece pre-loaded as a remix-in-progress (not today's hard-coded landscape). They see the original artist's attribution, the remixing UI, a "view more" link to the gallery, and a clear CTA to start their own drawing. This turns the front door into both a tool and an introduction to the community in one screen.

---

## 1. Gallery functionality

### Browse (`/gallery`)
- Two tabs: **Recent** (reverse chronological, default) and **Popular** (likes, recency-weighted).
- Grid of artwork cards. Each card shows the piece itself (emoji grid rendered faithfully at thumbnail size), the author handle/avatar, and like count.
- Infinite scroll or paginated load — visually a feed of artwork, not a search results list.
- No filters, no search, no tags in v1.

### Artwork detail (`/art/:id`)
- The piece rendered at a comfortable viewing size, with grid dimensions visible.
- Author chip (avatar + handle) linking to their profile.
- Publish date.
- Like button + like count. Liking requires sign-in (clicking while signed-out prompts sign-in, then completes the like).
- **Remix** button → opens the piece in the editor as the starting canvas (see Editor section).
- If this piece *is* a remix, a small "Remixed from <original>" breadcrumb links back to the parent piece.
- Copy-to-clipboard and download-PNG, reusing the editor's existing export affordances.
- Owner-only: delete this piece.

### Likes
- Toggleable heart on cards and on the detail page.
- One like per user per piece.
- Drives the Popular tab ordering.

### Remix
- Any visitor can remix any piece. Sign-in is required to *publish* the remix, not to start one.
- Remix means: "open this artwork as the editor's working canvas." Lineage is tracked so the published remix shows "Remixed from <original>."
- While in remix mode, the editor surfaces a persistent "Remixing <title?> by @<author>" chip with a link back to the original piece, and a clear **Start fresh** CTA that clears the canvas and unlinks the lineage.
- Remixing while the user has unsaved local work prompts: *Your current drawing will be replaced. Continue?* (with a "Download first" shortcut). This is the same affordance we'd want for any other destructive load. (Exception: a first-time visitor with no prior local work skips the prompt — see Onboarding.)

### Featured / curated pool
- A small set of staff-picked pieces (initially curated manually; mechanics deferred to Phase 2). The pool exists primarily to **seed the first-time visitor experience** with a high-quality starting canvas, and secondarily to give us a lightweight editorial surface on the gallery landing later.
- Each featured piece is just a normal gallery piece flagged as featured. Authors get attribution wherever it appears.

### Profile pages (`/u/:handle`)
- Public. Anyone can view any user's profile.
- Header: avatar, display name, handle, total likes received (optional v1), member-since date.
- Grid of that user's published pieces, newest first.
- Owner-viewing-own-profile: a clear path back to the editor and a "Manage" affordance on each piece (delete).

### Account & identity
- Sign-in is the gate to publishing, liking, and remix-publishing. Browsing never asks.
- Minimum profile: handle (unique), display name, avatar. Avatar can be an emoji the user picks (fits the brand and avoids upload UI in v1).
- Settings page (minimal): sign-out, delete account. Nothing else needed for v1.

### Deliberately out of scope for v1
Flagging these so they don't sneak back in:
- Comments / threads
- Collections / favorites separate from likes
- Tags, categories, search
- Multiple drafts / cloud-backed drawings in the editor
- Following users / activity feed
- Direct sharing to social platforms beyond a copyable permalink
- A dedicated "Featured" tab in the gallery (the curated pool exists for onboarding seed; surfacing it as its own browse mode can come later)

### Known gap to address before launch (not v1 feature, but required)
A minimum moderation path: a **report** action on each piece, and a way for an admin to take pieces down. Spell out before shipping, even if the implementation is just an email link in v0.

---

## 2. What the editor needs to add

The editor stays the editor. Changes are additive and small:

- **Header gains an account state.** Signed-out: a "Sign in" button. Signed-in: avatar that opens a small menu (Profile, Settings, Sign out). The header also gets a clear **Gallery** link.
- **Share section gains a "Publish" action**, alongside today's Copy and Download. Behavior:
  - Signed-out → prompts sign-in, then publishes.
  - Signed-in → one-click publishes the current canvas as a new piece. Success state: a toast/inline confirmation with a link to the new piece on the gallery, plus a copyable permalink.
  - There is no title/description dialog. The piece is identified by its ID and its author.
- **Remix entry point.** When the editor is opened via "Remix" from a gallery piece, it loads that piece's grid as the working canvas. The editor remembers the lineage in-session so that the *next* publish records "remixed from <id>." Starting a fresh drawing (or publishing) clears the lineage.
- **Remixing-mode UI.** While the editor holds remix lineage, it shows a persistent attribution chip ("Remixing by @<author>") with a link back to the source piece, and a **Start fresh** CTA that clears the canvas and the lineage in one action. This UI is shared with the first-time visitor onboarding (below).
- **First-time visitor onboarding.** When the editor loads with no prior local canvas (no localStorage entry from a previous session), it pulls a curated piece from the featured pool and loads it as a remix-in-progress instead of today's hard-coded landscape. The visitor immediately sees:
  - The curated artwork on the canvas, ready to be edited.
  - The remixing attribution chip naming the original artist.
  - A **View more in the gallery** link near the chip.
  - The **Start fresh** CTA to clear the canvas and begin their own drawing (which also unlinks the remix lineage so anything they publish is their own piece, not a remix).
  - No "your work will be replaced" warning, since there is no prior work.
  Once the user has touched the canvas (or chosen Start fresh), normal editor behavior takes over and subsequent visits boot into their own working canvas as today.
- **Destructive-load confirmation.** Loading a remix replaces the current localStorage canvas. The editor must warn first and offer a "Download current first" shortcut. The same pattern can later cover "open one of my published works to keep editing," though that's not a v1 ask.
- **"Your published works" shortcut** from the avatar menu, leading to the user's own profile page. This keeps the editor as the natural hub for a returning user.

What does *not* change:
- The canvas data model (`Painting: { width, height, grid: string[][] }`) is reused as-is. A published piece is just a snapshot of this structure plus author + timestamp.
- Local persistence stays. The local canvas is still the source of truth for in-progress work; publishing is a copy.
- All existing tools (draw, fill, erase, pan, palette, resize, copy, download) are untouched.

---

## 3. Information architecture

### Routes (target)
| Route | Purpose | Auth needed |
|---|---|---|
| `/` | Editor (today's home, unchanged in purpose) | No |
| `/gallery` | Browse feed — Recent + Popular tabs | No |
| `/art/:id` | Single artwork detail | No (likes/remix-publish gated) |
| `/u/:handle` | Public profile page | No |
| `/signin` | Sign-in landing | No |
| `/settings` | Sign-out / delete account | Yes |

### Navigation model
- **Global header (every page):** logo → `/`, "Gallery" link → `/gallery`, account control (sign-in or avatar menu).
- **From the editor:** Gallery in header; "Publish" in the Share section; avatar menu for profile/settings.
- **From the gallery:** card → artwork detail; author chip → profile; "Create" / "Open editor" CTA back to `/`.
- **From an artwork:** Remix → editor (with lineage); author chip → profile; back to gallery.
- **From a profile:** any piece → its detail page; "Open editor" CTA back to `/`.

### Mental model
The editor is the **workshop**. The gallery is the **wall**. Profiles are **each person's section of the wall**. Publishing moves a piece from the workshop to the wall; remixing takes a piece off the wall and back to a fresh workshop bench.

---

## 4. Acceptance criteria (product-level)

Before declaring v1 done, all three of the following user flows must work end-to-end:

- **First-time visitor:** lands in the editor with a curated piece pre-loaded as a remix → sees the original artist's attribution and a "View more in the gallery" link → either (a) clicks **Start fresh** to begin their own drawing, or (b) starts editing the curated piece directly. Either path leads naturally toward sign-in → publish.
- **Returning creator:** signs in from editor → publishes → toast links to the piece → clicks avatar → sees profile filling up.
- **Lurker:** never signs in, browses Recent and Popular freely, can download/copy any piece, only hits sign-in if they try to like or publish.

Plus the moderation gap (report + admin takedown) is addressed before public launch.
