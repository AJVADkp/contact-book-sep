# API Contract — Mini Contact Book

Base URL (prod): `https://mini-contact-book-api.onrender.com/api`
Base URL (local): `http://127.0.0.1:8000/api`

All contact endpoints require `Authorization: Bearer <access_token>`.
All contact endpoints are implicitly scoped to the authenticated user —
there is no `owner` parameter in any request; it's derived server-side.

## Auth

### `POST /api/auth/register/`
```json
// request
{ "email": "jane@example.com", "password": "correcthorsebattery" }

// 201 response
{ "id": 4, "email": "jane@example.com" }
```
- 400 if email already registered, with `{ "email": ["..."] }` shape matching
  DRF's default validation error format — don't invent a custom error envelope.

### `POST /api/auth/login/`
```json
// request
{ "email": "jane@example.com", "password": "correcthorsebattery" }

// 200 response
{ "access": "<jwt>", "refresh": "<jwt>" }
```

### `POST /api/auth/refresh/`
```json
// request
{ "refresh": "<jwt>" }

// 200 response
{ "access": "<new jwt>" }
```

## Contacts

### `GET /api/contacts/?search=<q>&ordering=name`
- `search`: matches against `name`, `company`, `email` (case-insensitive, partial).
- `ordering`: defaults to `name`; supports `-name`, `created_at`, `-created_at`.
- Returns only the caller's contacts.

```json
// 200 response
[
  {
    "id": 12,
    "name": "Ananya Rao",
    "email": "ananya@company.com",
    "phone": "+91 98765 43210",
    "company": "Nimbus Labs",
    "created_at": "2026-08-01T10:12:00Z",
    "updated_at": "2026-08-01T10:12:00Z"
  }
]
```

No pagination for v1 — at the stated scale (≤500 contacts/user) a flat list
is fine. If this were a real multi-thousand-row product, DRF's
`LimitOffsetPagination` would go here; don't add it prematurely.

### `POST /api/contacts/`
```json
// request
{ "name": "Ananya Rao", "email": "ananya@company.com", "phone": "+91 98765 43210", "company": "Nimbus Labs" }
```
- Only `name` is required. `owner` is rejected/ignored if sent by the client.
- 201 on success, 400 with field-level errors on validation failure.

### `GET /api/contacts/{id}/`
- 200 with the contact if it belongs to the caller.
- **404 (not 403)** if it exists but belongs to someone else — don't leak
  existence of another user's record via a 403.

### `PATCH /api/contacts/{id}/`
- Partial update, same ownership rule as GET.

### `DELETE /api/contacts/{id}/`
- 204 No Content on success, same ownership rule as GET.

## Error format

Use DRF's default: `{"field_name": ["error message"]}` for validation errors,
`{"detail": "..."}` for auth/permission/not-found errors. Do not wrap
everything in a custom `{success, data, error}` envelope — it's extra
surface area DRF already handles, and graders/reviewers expect the
framework-native shape.

## Status code summary

| Action | Success | Not found / not yours | Not authenticated |
|---|---|---|---|
| List | 200 | — | 401 |
| Retrieve | 200 | 404 | 401 |
| Create | 201 | — | 401 |
| Update | 200 | 404 | 401 |
| Delete | 204 | 404 | 401 |
