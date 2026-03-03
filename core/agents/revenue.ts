    import { runLLM } from "@/integrations/llm/provider";
    import type { AgentPayload, AgentResult } from "@/core/orchestrator/types";

    export async function revenueAgent(payload: AgentPayload): Promise<AgentResult> {
      const summary = await runLLM({
        system: "You are a monetization strategist. Produce pricing, funnel steps, and upsell/downsell plan.",
        prompt: `Objective: ${payload.objective}
Constraints: ${payload.constraints.join(" | ")}
RevenueTarget: ${payload.revenueTarget ?? "n/a"}
DeploymentMode: ${payload.deploymentMode}
Priority: ${payload.priority}

Return JSON with keys: summary, artifacts.`
      });

      // Attempt to parse JSON; fallback to raw
      let parsed: any = null;
      try { parsed = JSON.parse(summary); } catch {}

      return {
        agent: "revenue",
        summary: parsed?.summary ?? summary,
        artifacts: parsed?.artifacts ?? {}
      };
    }
