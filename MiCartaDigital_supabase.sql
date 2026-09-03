-- MI CARTA DIGITAL: BASE DE DATOS REAL
-- Supabase > SQL Editor > New query > pega TODO > Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_email text not null,
  recipient_email text not null,
  subject text not null,
  body text not null,
  decorations jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Si la tabla letters ya existía antes de esta versión:
alter table public.letters add column if not exists decorations jsonb not null default '[]'::jsonb;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  status text not null default 'inactive',
  plan text not null default 'premium',
  price numeric(10,2) not null default 20.00,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path=public
as $$ select exists (
  select 1 from public.profiles
  where id = auth.uid() and role = 'admin'
); $$;

alter table public.profiles enable row level security;
alter table public.letters enable row level security;
alter table public.reviews enable row level security;
alter table public.memberships enable row level security;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
for update using (public.is_admin());

drop policy if exists "letters sender insert" on public.letters;
create policy "letters sender insert" on public.letters
for insert with check (sender_id = auth.uid());

drop policy if exists "letters own read" on public.letters;
create policy "letters own read" on public.letters
for select using (
  sender_id = auth.uid()
  or (
    recipient_email = (select email from auth.users where id = auth.uid())
    and status = 'approved'
  )
  or public.is_admin()
);

drop policy if exists "letters admin update" on public.letters;
create policy "letters admin update" on public.letters
for update using (public.is_admin());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
for select using (true);

drop policy if exists "reviews own insert" on public.reviews;
create policy "reviews own insert" on public.reviews
for insert with check (user_id = auth.uid());

drop policy if exists "memberships own read" on public.memberships;
create policy "memberships own read" on public.memberships
for select using (user_id = auth.uid() or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  insert into public.profiles(id, name)
  values(new.id, coalesce(new.raw_user_meta_data->>'name',''));
  insert into public.memberships(user_id) values(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- DESPUÉS DE REGISTRAR TU CUENTA:
-- Authentication > Users > copia TU UUID.
-- Luego ejecuta:
-- update public.profiles set role='admin' where id='TU-UUID-AQUI';
