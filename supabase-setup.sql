-- ============================================================
-- Group Scoreboard — run this once in your Supabase SQL Editor
-- Project: https://pulqfbsxhcoodzqypbrh.supabase.co
-- ============================================================

create extension if not exists "pgcrypto";

-- 1. Table -----------------------------------------------------
create table if not exists public.group_scores (
  id uuid primary key default gen_random_uuid(),
  group_name text not null unique,
  score integer not null default 0 check (score >= 0),
  updated_at timestamptz not null default now()
);

-- 2. Grants ----------------------------------------------------
grant select on public.group_scores to anon, authenticated;
grant all on public.group_scores to service_role;

-- 3. Row Level Security ---------------------------------------
alter table public.group_scores enable row level security;

drop policy if exists "Public can read scores" on public.group_scores;
create policy "Public can read scores"
  on public.group_scores
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies: anonymous clients can never write directly.
-- All writes go through the security-definer RPC below.

-- 4. Seed the three fixed groups -------------------------------
insert into public.group_scores (group_name, score)
values ('Neel', 0), ('Dijla', 0), ('Furath', 0)
on conflict (group_name) do nothing;

-- 5. Atomic score update RPC -----------------------------------
create or replace function public.update_group_score(
  target_group text,
  adjustment integer,
  admin_key text
)
returns public.group_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.group_scores;
begin
  if admin_key is distinct from 'Admin@5001' then
    raise exception 'Not authorized';
  end if;

  if target_group not in ('Neel', 'Dijla', 'Furath') then
    raise exception 'Unknown group';
  end if;

  update public.group_scores
     set score = greatest(0, score + adjustment),
         updated_at = now()
   where group_name = target_group
  returning * into result;

  if result is null then
    raise exception 'Group not found';
  end if;

  return result;
end;
$$;

revoke all on function public.update_group_score(text, integer, text) from public;
grant execute on function public.update_group_score(text, integer, text) to anon, authenticated;

-- 6. Realtime --------------------------------------------------
alter table public.group_scores replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.group_scores;
exception
  when duplicate_object then null;
end;
$$;
