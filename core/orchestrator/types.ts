import { z } from "zod";

export const AgentPayloadSchema = z.object({
  objective: z.string().min(3),
  constraints: z.array(z.string()).default([]),
  revenueTarget: z.number().optional(),
  deploymentMode: z.enum(["local", "cloud", "hybrid"]),
  priority: z.enum(["low", "medium", "high"])
});

export type AgentPayload = z.infer<typeof AgentPayloadSchema>;

export type AgentResult = {
  agent: string;
  summary: string;
  artifacts?: Record<string, unknown>;
};

export type OrchestrationResult = {
  objective: string;
  steps: AgentResult[];
  adaptiveAction: "optimize_conversion" | "scale" | "hold";
};
