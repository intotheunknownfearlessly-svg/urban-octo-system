import type { AgentPayload, OrchestrationResult } from "./types";
import { logEvent } from "@/core/telemetry/logger";
import { saveMemory } from "@/core/memory/store";
import { adaptiveCheck } from "@/core/adaptive/engine";
import { runLaunchPipeline } from "@/core/launch/engine";
import { revenueOptimizer } from "@/core/revenue/optimizer";
import { architectAgent } from "@/core/agents/architect";
import { builderAgent } from "@/core/agents/builder";
import { optimizerAgent } from "@/core/agents/optimizer";
import { revenueAgent } from "@/core/agents/revenue";

export async function orchestrate(payload: AgentPayload): Promise<OrchestrationResult> {
  await logEvent("system", { event: "orchestrate_start", payload });

  const steps = [];
  const a = await architectAgent(payload); steps.push(a); await saveMemory("architect", a.summary);
  const r = await revenueAgent(payload, a); steps.push(r); await saveMemory("revenue", r.summary);
  const b = await builderAgent(payload, a, r); steps.push(b);
  const o = await optimizerAgent(payload, { a, r, b }); steps.push(o);

  const target = payload.revenueTarget ?? 10000;
  const adaptive = await adaptiveCheck(Math.max(1, target * 0.5));
  const launch = await runLaunchPipeline(payload.objective);
  const revenuePlan = await revenueOptimizer(target);

  await logEvent("system", { event: "orchestrate_end", adaptive });
  return { objective: payload.objective, steps, adaptive, launch, revenuePlan };
}
