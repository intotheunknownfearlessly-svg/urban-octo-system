import { supabaseServer } from '@/integrations/supabase/server';
export async function adaptiveCheck(revenueFloor:number){const {data}=await supabaseServer.from('revenue_events').select('revenue_amount');const total=data?.reduce((a,r)=>a+Number(r.revenue_amount),0)??0;return total<revenueFloor?{action:'optimize_conversion',total}:{action:'scale',total};}
