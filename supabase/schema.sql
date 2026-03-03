-- MANUS schema (enterprise baseline)
-- Run in Supabase SQL editor.

create extension if not exists vector;

-- Telemetry
create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  event_name text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- Revenue
create table if not exists revenue_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique,
  product_name text not null,
  currency text not null default 'usd',
  revenue_amount numeric not null,
  source text not null default 'stripe',
  created_at timestamptz default now()
);

-- Memory (semantic-ready)
create table if not exists agent_memory (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  content text not null,
  metadata jsonb,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Marketplace: agent registry
create table if not exists marketplace_agents (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  version text not null,
  capabilities jsonb not null default '[]'::jsonb,
  endpoint text,
  created_at timestamptz default now()
);

-- RLS: deny by default; use service role from server routes
alter table agent_logs enable row level security;
alter table revenue_events enable row level security;
alter table agent_memory enable row level security;
alter table marketplace_agents enable row level security;

-- Vector search RPC (cosine similarity)
create or replace function match_agent_memory(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  agent text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    agent_memory.id,
    agent_memory.agent,
    agent_memory.content,
    agent_memory.metadata,
    1 - (agent_memory.embedding <=> query_embedding) as similarity
  from agent_memory
  where agent_memory.embedding is not null
    and 1 - (agent_memory.embedding <=> query_embedding) > match_threshold
  order by agent_memory.embedding <=> query_embedding
  limit match_count;
$$;
