# Notes backend

Express API that sits between the frontend and Supabase. It verifies each
request's session token, then reads/writes the `notes` table using the
Supabase `service_role` key -- so authorization (only your own notes) and
input validation happen here, in code you control, not just in the database.

## Run locally

```bash
cp .env.example .env
```

Fill in `.env`:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` -- Supabase dashboard -> Project Settings -> API. The service_role key is under "service_role" / "secret" -- **not** the anon key.
- `ALLOWED_ORIGIN` -- `http://localhost:5173` for local dev (Vite's default port).

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001` by default. Check `http://localhost:3001/health` -- it should return `{"ok":true}`.

## Deploy to Render

1. Push this repo to GitHub (the whole repo, with both `frontend/` and `backend/` folders -- Render will only look at `backend/`).
2. In Render: **New** -> **Web Service** -> connect your GitHub repo.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (Render dashboard -> Environment):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ALLOWED_ORIGIN` -- set this to your **Vercel URL** once you have it (e.g. `https://your-app.vercel.app`). Not `*`.
5. Deploy. Render gives you a URL like `https://notes-backend.onrender.com`.
6. Put that URL into the frontend's `VITE_API_URL` environment variable on Vercel.

You'll likely deploy backend and frontend in a loop the first time: deploy
backend, get its URL, put it in the frontend's env vars and deploy that, get
the frontend's URL, put it in the backend's `ALLOWED_ORIGIN` and redeploy the
backend. That's normal for a two-service split.

## Why the service_role key is safe here

This key bypasses Row Level Security entirely -- it's as powerful as an
admin. That's fine *only* because:
- It only ever lives in Render's environment variables, never in any file that's committed or in any code that ships to a browser.
- Every route that uses it explicitly checks `req.user.id` (from a verified token) against the row being read/written, so the authorization Postgres would normally enforce via RLS is enforced by this code instead.

If you ever add a new route to this backend, it needs the same ownership
check -- `.eq('user_id', req.user.id)` -- or it will have no authorization
boundary at all.
