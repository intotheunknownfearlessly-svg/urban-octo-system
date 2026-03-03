import type { AgentPayload, OrchestrationResult } from "./types";
import { architectAgent } from "@/core/agents/architect";
import { revenueAgent } from "@/core/agents/revenue";
import { builderAgent } from "@/core/agents/builder";
import { optimizerAgent } from "@/core/agents/optimizer";
import { adaptiveRevenueAction } from "@/core/revenue/optimizer";
import { saveMemory } from "@/core/memory/store";
import { logEvent } from "@/core/telemetry/logger";

export async function orchestrate(payload: AgentPayload): Promise<OrchestrationResult> {
  await logEvent("orchestrator", "orchestrate_start", { payload });

  const steps = [];
  const a = await architectAgent(payload);
  steps.push(a);
  await saveMemory("architect", a.summary, { objective: payload.objective });

  const r = await revenueAgent(payload);
  steps.push(r);
  await saveMemory("revenue", r.summary, { objective: payload.objective });

  const b = await builderAgent(payload);
  steps.push(b);

  const o = await optimizerAgent(payload);
  steps.push(o);

  const adaptiveAction = await adaptiveRevenueAction();

  await logEvent("orchestrator", "orchestrate_end", { adaptiveAction });

  return {
    objective: payload.objective,
    steps,
    adaptiveAction: adaptiveAction ?? "hold"
  };
}
