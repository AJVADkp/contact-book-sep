# Master Prompt — Mini Contact Book (for Antigravity)

Paste this as the initial task prompt in Antigravity. Keep `PRD.md`,
`ARCHITECTURE.md`, `API_SPEC.md`, `DEPLOYMENT.md`, and `CODING_STANDARDS.md`
in the repo root (or wherever you point the agent) so it can read them
directly rather than relying on this prompt to restate every detail.

---

## PROMPT START

You are acting as a senior full-stack engineer pairing with me on a real
project, not generating a demo or tutorial. Read `PRD.md`,
`ARCHITECTURE.md`, `API_SPEC.md`, `DEPLOYMENT.md`, and `CODING_STANDARDS.md`
in this repository before writing any code — they are the spec, not
background reading. If anything you're about to build contradicts them,
stop and flag the contradiction instead of silently picking one.

### What you're building

A private, per-user contact book: Django REST Framework backend, React
frontend, deployed split across Render (backend + Postgres) and Vercel
(frontend). Two-pane UI — searchable alphabetized contact list on the left,
selected contact's full detail on the right. Full auth (register/login,
JWT), full CRUD on contacts, contacts strictly scoped to their owner.

### Hard constraints — do not deviate from these without asking

1. **Ownership enforcement happens at the queryset level**
   (`Contact.objects.filter(owner=request.user)`), in every view that
   touches a contact by ID, not only in the serializer. This is the single
   most important correctness requirement in this project.
2. **`owner` is never accepted from client input.** It's set server-side
   from `request.user` on create and never exposed as a writable serializer
   field.
3. **Production settings:** `DEBUG=False`, secrets from environment
   variables only (never hardcoded, never committed), `ALLOWED_HOSTS` and
   `CORS_ALLOWED_ORIGINS` set explicitly per `DEPLOYMENT.md` — do not
   default to `ALLOWED_HOSTS = ["*"]` "to make it work," and do not leave
   `DEBUG=True` even temporarily "for the demo."
4. **Database:** Postgres in production via `DATABASE_URL`, SQLite only for
   local dev. Do not deploy with SQLite on Render.
5. **Auth:** JWT via `djangorestframework-simplejwt`, not session/cookie
   auth — the frontend and backend are on different domains.
6. **No pagination, no tagging, no CSV import, no team sharing** — these
   are explicitly out of scope per `PRD.md` section 3. If you find yourself
   adding any of them "for completeness," stop.
7. **Code style follows `CODING_STANDARDS.md` exactly** — this matters as
   much as functional correctness for this project. Concretely: no blanket
   exception handling, no docstrings on trivial functions, no
   narration-style comments, no emoji anywhere (code, commits, or UI copy),
   commits made incrementally per logical unit rather than one giant
   initial commit.

### Build order

Work in this sequence, and treat each stage as something you'd actually
commit separately:

1. **Backend scaffold** — Django project (`config/`), one app
   (`contacts/`), `Contact` model exactly as specified in
   `ARCHITECTURE.md` section 5, initial migration.
2. **Auth** — registration and JWT login/refresh endpoints per
   `API_SPEC.md`, using the built-in `User` model (no custom user model
   needed for this scope — don't add one).
3. **Contact CRUD API** — serializer (with `owner` read-only), viewset,
   `IsOwner` permission class, search/ordering filter backend, URLs. Match
   `API_SPEC.md` exactly, including status codes (404 not 403 for
   someone-else's contact, 401 for unauthenticated).
4. **Backend tests** — at minimum: a test proving user A cannot retrieve,
   update, or delete user B's contact (this is the test that actually
   verifies requirement #1 above, not just a happy-path CRUD test).
5. **Local verification** — run the backend locally, hit every endpoint
   with two different users via curl or the DRF browsable API, confirm
   isolation before touching the frontend.
6. **Frontend scaffold** — Vite + React project structure per
   `ARCHITECTURE.md` section 4, routing, `AuthContext`.
7. **Auth UI** — login/register pages, token storage, axios interceptor
   for silent refresh on 401.
8. **Contacts UI** — `ContactList` + `SearchBar` (debounced, server-side
   search) on the left, `ContactDetail` on the right, `ContactForm` for
   create/edit, delete with confirmation. Empty state and no-results state
   are distinct, per `PRD.md` section 5.3.
9. **Local integration test** — full flow against the local backend:
   register, log in, create/search/edit/delete, refresh the page and
   confirm the session survives.
10. **Deployment** — follow `DEPLOYMENT.md` exactly, in the order it's
    written (Render backend first, note the live URL, then Vercel frontend
    pointed at it, then back to Render to lock down `CORS_ALLOWED_ORIGINS`
    to the real Vercel URL).
11. **Post-deploy checklist** — work through `DEPLOYMENT.md` section 3
    item by item against the live URLs, not localhost.

### What "done" looks like

Everything in `PRD.md` section 8 (Success criteria) is checked, using the
live Render/Vercel URLs, with two distinct test accounts to prove data
isolation. Don't report this as complete based on local-only testing.

### If you get stuck or something in the spec is ambiguous

Say so explicitly and propose the resolution you'd pick as a senior
engineer, rather than guessing silently and moving on. I'd rather answer
one clarifying question than review 500 lines built on a wrong assumption.

## PROMPT END
