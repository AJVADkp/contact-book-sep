# Architecture — Mini Contact Book

## 1. Stack

| Layer      | Choice                                             | Why |
|------------|-----------------------------------------------------|-----|
| Backend    | Django 5.x + Django REST Framework                  | Matches your training track, DRF gives serializers/permissions/filtering for free |
| Auth       | `djangorestframework-simplejwt`                     | Stateless, works cleanly across Render↔Vercel (different domains, session cookies would fight CORS/SameSite) |
| DB (prod)  | PostgreSQL (Render managed Postgres)                | Render's disk is ephemeral — SQLite gets wiped on every redeploy |
| DB (local) | SQLite                                              | Zero setup for local dev, swapped via `DATABASE_URL` env var |
| Static/admin | WhiteNoise                                        | Serves Django admin CSS/JS in production without Nginx |
| Frontend   | React (Create React App or Vite — Vite recommended, CRA is effectively unmaintained) | SPA, matches training track |
| HTTP client| `fetch` or `axios`                                  | axios recommended for interceptor-based token refresh |
| Backend host | Render (free web service + free Postgres)         | Your requirement |
| Frontend host | Vercel                                            | Your requirement |

This is **Option B (microservices / split hosting)** from the training deck,
not Option A (Django serving the React build). That's the right call for a
portfolio piece — it's how real teams actually deploy — but it means CORS and
cross-origin auth are not optional extras, they're core to the design.

## 2. Request flow

```
Browser (Vercel, https://mini-contact-book.vercel.app)
   |
   |  fetch('https://mini-contact-book-api.onrender.com/api/contacts/?search=...')
   |  Authorization: Bearer <access_token>
   v
Render (Django + DRF)
   |
   |  request.user resolved from JWT
   |  ContactViewSet.get_queryset() -> Contact.objects.filter(owner=request.user)
   v
PostgreSQL (Render managed)
```

Every list/detail/update/delete query is scoped to `owner=request.user` at
the ORM level. This is not optional and not something the serializer should
be trusted to enforce alone — a serializer can be bypassed by a raw
`Contact.objects.get(pk=x)` call in a careless view; the queryset filter is
the actual boundary.

## 3. Backend structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
├── config/                     # project package (was "UniversityHub" in the deck; renamed to match this project)
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── contacts/                   # the one app this project needs — resist splitting into more
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    ├── permissions.py          # IsOwner permission class
    ├── filters.py              # search/ordering config, kept out of views.py
    ├── migrations/
    └── tests/
        ├── test_models.py
        ├── test_permissions.py
        └── test_api.py
```

`accounts` (registration) can live inside `contacts` for a project this size,
or as its own tiny app — either is fine. Don't create four apps for a
one-model project; that's the over-engineering equivalent of the deck's
Student/Course/Department split, which doesn't apply here.

## 4. Frontend structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api/
    │   ├── client.js            # axios instance + token refresh interceptor
    │   ├── auth.js
    │   └── contacts.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── ContactList.jsx
    │   ├── ContactListItem.jsx
    │   ├── ContactDetail.jsx
    │   ├── ContactForm.jsx
    │   ├── SearchBar.jsx
    │   └── ProtectedRoute.jsx
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── ContactsPage.jsx
    ├── hooks/
    │   └── useDebounce.js
    └── styles/
        └── (plain CSS or CSS modules — do not pull in a component library for a two-pane layout)
```

## 5. Data model

```python
class Contact(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    company = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["owner", "name"])]

    def __str__(self):
        return self.name
```

Notes:
- `owner` is set from `request.user` in the view (`serializer.save(owner=self.request.user)`),
  **never** accepted as a field from the client. It's read-only in the serializer.
- The composite index on `(owner, name)` is what makes the alphabetized,
  per-user list fast — this is the kind of detail that's easy to skip and
  invisible until you have real data volume.

## 6. Environment variables

**Backend (Render):**
```
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=mini-contact-book-api.onrender.com
DATABASE_URL=              # auto-provided by Render Postgres addon
CORS_ALLOWED_ORIGINS=https://mini-contact-book.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_BASE_URL=https://mini-contact-book-api.onrender.com/api
```

## 7. CORS & security config (settings.py essentials)

```python
DEBUG = env.bool("DEBUG", default=False)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])
CORS_ALLOW_CREDENTIALS = True

SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
```

`django-cors-headers` and `django-environ` (or `python-decouple`) are
required dependencies — pin them in `requirements.txt`.
