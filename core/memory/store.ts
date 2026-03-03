import { supabaseServer } from "@/integrations/supabase/server";
import { embed } from "@/integrations/llm/provider";

export async function saveMemory(agent: string, content: string, metadata?: Record<string, unknown>) {
  const embedding = await embed(content);
  await supabaseServer.from("agent_memory").insert({
    agent,
    content,
    metadata: metadata ?? {},
    embedding
  });
}

export async function semanticSearch(query: string, opts?: { threshold?: number; count?: number }) {
  const embedding = await embed(query);
  const { data, error } = await supabaseServer.rpc("match_agent_memory", {
    query_embedding: embedding,
    match_threshold: opts?.threshold ?? 0.78,
    match_count: opts?.count ?? 5
  });
  if (error) throw error;
  return data ?? [];
}
