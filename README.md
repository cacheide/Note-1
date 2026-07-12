# Notes frontend

React + Vite + Tailwind. Handles sign-up/sign-in directly with Supabase Auth;
all notes CRUD goes through the backend API (see `../backend`), not Supabase
directly.

## Run locally

```bash
cp .env.example .env
```

Fill in `.env`:
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` -- Supabase dashboard -> Project Settings -> API.
- `VITE_API_URL` -- `http://localhost:3001` if you're running the backend locally too.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Deploy to Vercel

1. Push the whole repo to GitHub (both `frontend/` and `backend/` -- Vercel will only look at `frontend/`).
2. In Vercel: **Add New** -> **Project** -> import your GitHub repo.
3. Set:
   - **Root Directory**: `frontend`
   - Framework preset: Vite (should auto-detect). Build command `npm run build`, output directory `dist`.
4. Add environment variables (Project -> Settings -> Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` -- your Render backend URL, e.g. `https://notes-backend.onrender.com`
5. Deploy.
6. In Supabase, **Authentication -> URL Configuration**: set Site URL to your new Vercel URL and add it to Redirect URLs.
7. In Render, update the backend's `ALLOWED_ORIGIN` to this same Vercel URL and redeploy the backend.
