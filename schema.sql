-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- Note: the backend API uses the service_role key, which bypasses these
-- policies -- so the backend's own code (backend/src/routes/notes.js) is
-- what actually enforces "only your own notes" for that path. RLS stays
-- enabled here anyway as a second layer: if the anon key is ever queried
-- directly (now or in a future change), it still can't leak other users'
-- rows.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text not null default '' check (char_length(body) <= 5000),
  created_at timestamptz not null default now()
);

-- Speeds up "get my notes" queries, which is how the app always reads.
create index if not exists notes_user_id_created_at_idx
  on public.notes (user_id, created_at desc);

-- Turn on Row Level Security. Until policies are added below, this
-- blocks ALL access — nothing leaks by default.
alter table public.notes enable row level security;

-- Each policy is scoped with auth.uid() = user_id, so Postgres itself
-- enforces that a user can only ever see or touch their own rows,
-- no matter what the frontend sends.

create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);
