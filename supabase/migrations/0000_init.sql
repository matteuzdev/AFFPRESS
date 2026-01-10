-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (handled by Supabase Auth, but usually we reference auth.users)
-- Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  offer_name text,
  geo text,
  status text default 'draft' check (status in ('draft', 'ready', 'exported')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pages Table
create table public.pages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  type text check (type in ('cloned', 'pressel')) not null,
  source_url text, -- only for cloned
  slug text,
  html_raw text,
  html_edited text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Links Table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references public.pages(id) on delete cascade not null,
  selector text,
  original_url text,
  new_url text,
  is_affiliate boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Scripts Table (Global)
create table public.scripts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  position text check (position in ('head', 'body-end')) not null,
  script_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Page Scripts (Relation)
create table public.page_scripts (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references public.pages(id) on delete cascade not null,
  script_id uuid references public.scripts(id) on delete cascade not null,
  unique(page_id, script_id)
);

-- RLS Policies
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.links enable row level security;
alter table public.scripts enable row level security;
alter table public.page_scripts enable row level security;

-- Projects Policy
create policy "Users can view their own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert their own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on public.projects
  for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- Pages Policy (via Project)
create policy "Users can manage pages of their projects" on public.pages
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = pages.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Links Policy (via Page -> Project)
create policy "Users can manage links of their pages" on public.links
  for all using (
    exists (
      select 1 from public.pages
      join public.projects on projects.id = pages.project_id
      where pages.id = links.page_id
      and projects.user_id = auth.uid()
    )
  );

-- Scripts Policy
create policy "Users can view their own scripts" on public.scripts
  for select using (auth.uid() = user_id);
create policy "Users can insert their own scripts" on public.scripts
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own scripts" on public.scripts
  for update using (auth.uid() = user_id);
create policy "Users can delete their own scripts" on public.scripts
  for delete using (auth.uid() = user_id);

-- Page Scripts Policy
create policy "Users can manage page scripts" on public.page_scripts
  for all using (
    exists (
      select 1 from public.pages
      join public.projects on projects.id = pages.project_id
      where pages.id = page_scripts.page_id
      and projects.user_id = auth.uid()
    )
  );
