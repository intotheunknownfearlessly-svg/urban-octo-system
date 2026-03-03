import { supabaseServer } from "@/integrations/supabase/server";

export type MarketplaceAgent = {
  name: string;
  version: string;
  capabilities: unknown[];
  endpoint?: string | null;
};

export async function registerAgent(agent: MarketplaceAgent) {
  const { error } = await supabaseServer.from("marketplace_agents").upsert({
    name: agent.name,
    version: agent.version,
    capabilities: agent.capabilities,
    endpoint: agent.endpoint ?? null
  }, { onConflict: "name" });

  if (error) throw error;
}

export async function listAgents() {
  const { data, error } = await supabaseServer.from("marketplace_agents").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
