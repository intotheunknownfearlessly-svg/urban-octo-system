import { supabaseServer } from "@/integrations/supabase/server";
import { systemConfig } from "@/configs/system";

export async function getRevenueTotal() {
  const { data, error } = await supabaseServer.from("revenue_events").select("revenue_amount");
  if (error) throw error;
  return (data ?? []).reduce((acc, r) => acc + Number((r as any).revenue_amount), 0);
}

export async function adaptiveRevenueAction() {
  const total = await getRevenueTotal();
  if (total <= 0) return "optimize_conversion" as const;
  if (total < systemConfig.orchestration.revenueFloor) return "optimize_conversion" as const;
  return "scale" as const;
}
