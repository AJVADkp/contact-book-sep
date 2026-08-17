# Deployment Runbook — Mini Contact Book

This corrects and extends the deployment section of the Day 14 training
deck: that deck's `DEBUG=True` shortcut is fine for a classroom demo where
nothing is public; it is not fine for a live URL you're putting in a
portfolio. Follow this instead.

## 1. Backend on Render

### 1.1 Repo prep
```
requirements.txt        # pip freeze, pinned versions
runtime.txt              # optional: python-3.12.x
Procfile / render start command:
  gunicorn config.wsgi:application
```

`requirements.txt` must include at least:
```
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-environ
psycopg2-binary
gunicorn
whitenoise
```

### 1.2 settings.py production essentials
```python
DEBUG = env.bool("DEBUG", default=False)

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ...rest of Django's default middleware
]

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

DATABASES = {"default": env.db("DATABASE_URL")}
```

### 1.3 Render setup steps
1. Push repo to GitHub.
2. Render dashboard → New → PostgreSQL → note the internal `DATABASE_URL`.
3. Render dashboard → New → Web Service → connect the repo, root directory
   set to `backend/` if it's a monorepo.
4. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command: `gunicorn config.wsgi:application`
6. Environment variables (Render dashboard, not committed anywhere):
   - `SECRET_KEY` — generate a fresh one, don't reuse the Django default
   - `DEBUG=False`
   - `ALLOWED_HOSTS=<your-service>.onrender.com`
   - `DATABASE_URL` — linked automatically if you attach the Postgres addon
   - `CORS_ALLOWED_ORIGINS=https://<your-project>.vercel.app`
7. Deploy, then hit `https://<your-service>.onrender.com/api/contacts/` and
   confirm you get a 401 (not a 500) — a 500 here means settings are
   misconfigured, a 401 means auth is correctly enforced.

### 1.4 Known Render free-tier behavior
- Free web services spin down after ~15 minutes idle and take 20–50s to
  wake on the next request. Build this into the frontend's loading UX —
  don't let it look broken.
- Free Postgres databases expire after a fixed period on some plans — check
  current Render terms before you rely on it long-term for anything beyond
  a portfolio piece.

## 2. Frontend on Vercel

### 2.1 Repo prep
- `frontend/.env.example` documents `VITE_API_BASE_URL` (or
  `REACT_APP_API_URL` if you stick with CRA).
- Never commit the real `.env` — only `.env.example`.

### 2.2 Vercel setup steps
1. Import the GitHub repo into Vercel, set root directory to `frontend/`
   if it's a monorepo.
2. Framework preset: Vite (or Create React App if that's what you used).
3. Environment variable: `VITE_API_BASE_URL=https://<your-service>.onrender.com/api`
4. Deploy. Vercel gives you `https://<project>.vercel.app`.
5. **Go back to Render and set `CORS_ALLOWED_ORIGINS` to this exact URL**,
   then redeploy the backend. This ordering trips people up — the frontend
   URL doesn't exist until after the first Vercel deploy, so CORS can't be
   configured correctly until you've done step 4 once.

## 3. Post-deploy verification checklist

- [ ] Register a new user against the live API from the live frontend.
- [ ] Log in, confirm the token persists across a page refresh.
- [ ] Create, search, edit, and delete a contact end-to-end on the deployed
      site (not localhost).
- [ ] Open the frontend in a private/incognito window with a second test
      account and confirm you cannot see the first account's contacts.
- [ ] Confirm `DEBUG=False` by visiting a deliberately broken URL on the API
      and checking you get a generic error page, not a stack trace.
- [ ] Confirm no secrets appear in the GitHub repo (`git log -p | grep -i secret_key` as a sanity check, or just review `.env.example` vs `.gitignore`).

## 4. Rollback

Render and Vercel both keep prior deploys — use "redeploy previous" in
either dashboard rather than force-pushing a revert commit under time
pressure before a demo.
