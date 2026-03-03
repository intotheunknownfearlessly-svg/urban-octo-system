import { supabaseServer } from '@/integrations/supabase/server';
export async function logEvent(agent:string,payload:any){await supabaseServer.from('agent_logs').insert({agent,payload});}
