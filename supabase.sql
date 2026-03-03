create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists revenue_events (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  revenue_amount numeric not null,
  source text,
  created_at timestamptz default now()
);

create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists agent_memory (
  id uuid primary key default gen_random_uuid(),
  agent text,
  content text,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table if not exists agent_permissions (
  id uuid primary key default gen_random_uuid(),
  agent text,
  role text,
  allowed boolean default true
);

alter table revenue_events enable row level security;
alter table agent_logs enable row level security;
alter table agent_memory enable row level security;
alter table agent_permissions enable row level security;

create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  agent text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    agent_memory.id,
    agent_memory.agent,
    agent_memory.content,
    1 - (agent_memory.embedding <=> query_embedding) as similarity
  from agent_memory
  where 1 - (agent_memory.embedding <=> query_embedding) > match_threshold
  order by agent_memory.embedding <=> query_embedding
  limit match_count;
$$;
