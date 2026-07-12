# Notebook

A notes app with a real frontend/backend split: sign up and log in with
email + password, create/read/update/delete your own notes, and never see
anyone else's.

## Structure

```
frontend/   React + Vite + Tailwind -> deploy to Vercel
backend/    Express API -> deploy to Render
supabase/   schema.sql -- run once in Supabase's SQL editor
```

- **frontend/** talks to Supabase directly only for auth (sign up, sign in, session). See `frontend/README.md`.
- **backend/** is the only thing that reads or writes the `notes` table. It verifies each request's session token, then enforces "only your own notes" explicitly in its own code using Supabase's `service_role` key. See `backend/README.md`.
- **supabase/schema.sql** creates the table and Row Level Security policies. RLS stays on as a second layer of defense even though the backend's `service_role` key bypasses it -- see the comment at the top of that file.

## Setup order

1. Create a Supabase project, run `supabase/schema.sql` in its SQL editor.
2. Set up and run `backend/` locally (see `backend/README.md`).
3. Set up and run `frontend/` locally, pointing `VITE_API_URL` at your local backend (see `frontend/README.md`).
4. When ready to deploy: backend to Render first (you need its URL for the frontend), then frontend to Vercel, then loop back and update the backend's `ALLOWED_ORIGIN` with the real Vercel URL.

## Security checklist

| Practice | How this project handles it |
|---|---|
| Never store raw passwords | Supabase Auth hashes and stores passwords server-side -- neither frontend nor backend code ever touches them. |
| Never put secrets in frontend code | Only the public Supabase `anon` key ships to the browser. The `service_role` key lives only in Render's environment variables. |
| Never commit `.env` | Both `frontend/.gitignore` and `backend/.gitignore` exclude it. |
| Never open CORS to every origin | `backend/src/server.js` only allows the single origin in `ALLOWED_ORIGIN` -- never `*`. |
| Always check authorization on sensitive actions | Every route in `backend/src/routes/notes.js` explicitly filters by `req.user.id`, which comes from a verified token, not from anything the client sent. |
| Always validate input before saving | `validateNote()` in `backend/src/routes/notes.js` checks title/body presence and length before any database write; the `notes` table also has matching `check` constraints as a backstop. |
| Never trust data from the frontend | The backend ignores any `user_id` the client might send and always uses the one from the verified token. Ownership is re-checked on every update/delete before touching a row. |

## Before going to production

- [ ] Set the backend's `ALLOWED_ORIGIN` to your real Vercel URL (not `*`, not `localhost`).
- [ ] Set Supabase's **Authentication -> URL Configuration** Site URL / Redirect URLs to your real Vercel URL.
- [ ] Re-enable "Confirm email" in Supabase if you turned it off for local testing.
- [ ] Double-check the `service_role` key only appears in Render's environment variables -- never in a file, a commit, or the frontend build.
