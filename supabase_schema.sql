-- ==============================================================================
-- TechPilot - Supabase PostgreSQL Schema
-- Developed by Rocky Technologies
-- ==============================================================================

-- Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  avatar_url text,
  skill_level text default 'intermediate' check (skill_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  preferred_languages text[] default '{}',
  preferred_approach text default 'ai-assisted',
  budget_preference text default 'mostly-free' check (budget_preference in ('free', 'mostly-free', 'limited-paid', 'no-restriction')),
  existing_subscriptions text[] default '{}',
  team_type text default 'individual' check (team_type in ('individual', 'small-team', 'large-team')),
  project_interests text[] default '{}',
  onboarding_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects Table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  stage text default 'idea' check (stage in ('idea', 'planning', 'design', 'development', 'testing', 'deployment')),
  current_task text,
  deadline date,
  budget_preference text default 'mostly-free',
  team_type text default 'individual',
  selected_technologies text[] default '{}',
  rejected_technologies text[] default '{}',
  saved_recommendations text[] default '{}',
  completed_milestones int default 0,
  total_milestones int default 6,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Milestones Table
create table if not exists public.milestones (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  completed boolean default false,
  stage text not null,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Advisor Messages Table
create table if not exists public.advisor_messages (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'advisor')),
  content text not null,
  recommendations jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.advisor_messages enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Projects: users can CRUD their own projects
create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);

-- Milestones: users can manage milestones of their own projects
create policy "Users can manage own project milestones" on public.milestones for all using (
  exists (select 1 from public.projects where projects.id = milestones.project_id and projects.user_id = auth.uid())
);

-- Advisor Messages: users can view and insert their own messages
create policy "Users can view own messages" on public.advisor_messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.advisor_messages for insert with check (auth.uid() = user_id);
