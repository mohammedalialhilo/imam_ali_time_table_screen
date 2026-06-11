create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_profiles
  add column if not exists email text,
  add column if not exists role text,
  add column if not exists active boolean default true,
  add column if not exists created_at timestamptz default timezone('utc', now()),
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.admin_profiles as profiles
set
  email = lower(coalesce(nullif(profiles.email, ''), users.email, concat(profiles.id::text, '@placeholder.invalid'))),
  role = coalesce(nullif(profiles.role, ''), 'admin'),
  active = coalesce(profiles.active, true)
from auth.users as users
where users.id = profiles.id;

alter table public.admin_profiles
  alter column email set not null,
  alter column role set not null,
  alter column active set not null,
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.admin_profiles
  drop constraint if exists admin_profiles_role_check;

alter table public.admin_profiles
  add constraint admin_profiles_role_check
  check (role in ('super_admin', 'admin'));

create unique index if not exists admin_profiles_email_idx
  on public.admin_profiles (email);

create index if not exists admin_profiles_role_idx
  on public.admin_profiles (role);

create index if not exists admin_profiles_active_idx
  on public.admin_profiles (active);

create or replace function public.set_admin_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;

create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row
execute function public.set_admin_profiles_updated_at();

create or replace function public.is_active_super_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = check_user_id
      and role = 'super_admin'
      and active = true
  );
$$;

revoke all on function public.is_active_super_admin(uuid) from public;
grant execute on function public.is_active_super_admin(uuid) to authenticated;

alter table public.admin_profiles enable row level security;

drop policy if exists "admin_profiles_select_own" on public.admin_profiles;
create policy "admin_profiles_select_own"
on public.admin_profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "admin_profiles_select_super_admin" on public.admin_profiles;
create policy "admin_profiles_select_super_admin"
on public.admin_profiles
for select
to authenticated
using (public.is_active_super_admin(auth.uid()));

drop policy if exists "admin_profiles_update_super_admin" on public.admin_profiles;
create policy "admin_profiles_update_super_admin"
on public.admin_profiles
for update
to authenticated
using (public.is_active_super_admin(auth.uid()))
with check (public.is_active_super_admin(auth.uid()));

drop policy if exists "admin_profiles_delete_super_admin" on public.admin_profiles;
create policy "admin_profiles_delete_super_admin"
on public.admin_profiles
for delete
to authenticated
using (public.is_active_super_admin(auth.uid()));
