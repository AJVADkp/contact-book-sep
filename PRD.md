# PRD — Mini Contact Book

**Owner:** [your name]
**Status:** Draft v1
**Last updated:** 2026-08-17

## 1. Problem

Freelancers, students, and professionals accumulate contacts across email threads,
LinkedIn, WhatsApp, and business cards, with no single private place to keep the
ones that actually matter. Spreadsheets don't scale past ~30 rows and have no
per-user access control. This app is a minimal, private, per-user address book.

## 2. Goals

- A user can sign up, log in, and see **only their own** contacts.
- A user can create, view, edit, and delete a contact.
- The contact list is alphabetized and searchable in real time.
- Selecting a contact from the list shows full details on the right without a
  page reload.
- Backend deployed on Render, frontend on Vercel, talking over a REST API.

## 3. Non-goals (explicitly out of scope for v1)

- Contact sharing / teams / multi-user visibility.
- Import from CSV / Google Contacts / vCard.
- Tagging, grouping, or favoriting contacts.
- Email/SMS integration, reminders, birthdays.
- Mobile app. (Responsive web is enough.)
- Password reset via email (can stub — real SMTP is a v2 concern).

These are listed so scope creep has something concrete to point at. If any of
these show up mid-build, that's a sign the spec is being renegotiated silently
— don't let an agent (or yourself) add them without updating this file first.

## 4. Users & core user story

Single persona: an individual professional managing their own private
contacts. No admin/teacher/student roles, no org hierarchy — resist the urge
to over-model this like the University Hub example in the training deck. This
is a single-tenant-per-user app.

**Primary story:**
> As a logged-in user, I want to search my contacts by name and see full
> details instantly, so I can find someone's phone number or company in
> under 3 seconds.

## 5. Functional requirements

### 5.1 Auth
- Register with email + password.
- Log in, receive JWT access + refresh token pair.
- Access token auto-refreshes silently on the frontend.
- Log out clears tokens client-side.

### 5.2 Contacts (CRUD)
- Create a contact: name (required), email (optional, validated format),
  phone (optional), company (optional).
- List contacts: returns only the authenticated user's contacts, sorted
  alphabetically by name (case-insensitive), server-side.
- Search: partial, case-insensitive match against name, and secondarily
  company/email, updated as the user types (debounced ~300ms).
- View a single contact's full detail.
- Edit any field of an existing contact.
- Delete a contact with a confirmation step (no silent deletes).

### 5.3 UI behavior
- Two-pane layout: contact list (left), detail panel (right).
- List shows name + company as the secondary line; grouped by first letter
  is a nice-to-have, not a blocker for v1 — ship flat sorted list first.
- Selecting a list item populates the detail panel without navigating away
  (SPA behavior — no full page reload, no route change required, though a
  `/contacts/:id` route is fine if you want deep-linking).
- Empty state: "No contacts yet" with a create button, shown when the list
  is empty.
- No-results state: distinct message when a search yields zero matches
  (don't reuse the empty-state copy — it's confusing).

## 6. Non-functional requirements

- **Privacy:** a user must never be able to read, edit, or delete another
  user's contact by guessing/incrementing an ID. This is enforced at the
  queryset level in every view, not just in the serializer.
- **Performance:** list + search should feel instant for up to ~500 contacts
  per user. No client-side full-table scan for search — server-side query.
- **Security:** `DEBUG=False` in production, secrets via environment
  variables only, CORS locked to the known Vercel origin(s), HTTPS enforced
  by both hosts by default.
- **Availability:** free-tier Render web services cold-start after
  inactivity — the frontend should show a loading state that tolerates a
  10–30s first request, not a blank screen.

## 7. Data model (summary — full spec in ARCHITECTURE.md)

```
User (Django built-in)
  └── Contact
        - name       (required)
        - email      (optional)
        - phone      (optional)
        - company    (optional)
        - owner      (FK -> User, required, not exposed as editable in API)
        - created_at
        - updated_at
```

## 8. Success criteria (how you know v1 is done)

- [ ] Two different test users can each create contacts and confirm they
      cannot see each other's data (manual test, not just "it looks fine").
- [ ] Search returns correct results for partial, case-insensitive queries.
- [ ] Full CRUD works end-to-end against the deployed (not local) API.
- [ ] Backend live on Render with Postgres, `DEBUG=False`, no secrets in
      the repo.
- [ ] Frontend live on Vercel, pointed at the Render API via env var.
- [ ] Refreshing the page keeps the user logged in (token persisted, not
      lost on reload).

## 9. Future scope (v2, not now)

- Contact tagging / grouping.
- CSV import/export.
- Shared contacts within a team.
- Real password-reset email flow.
