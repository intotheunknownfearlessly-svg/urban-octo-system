    import { runLLM } from "@/integrations/llm/provider";
    import type { AgentPayload, AgentResult } from "@/core/orchestrator/types";

    export async function optimizerAgent(payload: AgentPayload): Promise<AgentResult> {
      const summary = await runLLM({
        system: "You are a conversion optimizer. Produce experiments, tracking plan, and friction removals.",
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
        agent: "optimizer",
        summary: parsed?.summary ?? summary,
        artifacts: parsed?.artifacts ?? {}
      };
    }
