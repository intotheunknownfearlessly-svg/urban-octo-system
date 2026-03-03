import { z } from "zod";
export const AgentPayloadSchema = z.object({
  objective: z.string().min(3),
  constraints: z.array(z.string()).default([]),
  revenueTarget: z.number().optional(),
  deploymentMode: z.enum(["local", "cloud", "hybrid"]),
  priority: z.enum(["low", "medium", "high"])
});
export type AgentPayload = z.infer<typeof AgentPayloadSchema>;
export type AgentResult = { agent: string; summary: string; artifacts?: Record<string, any> };
export type OrchestrationResult = {
  objective: string;
  steps: AgentResult[];
  adaptive: { action: string; total: number };
  launch: { market: string; offer: string; copy: string };
  revenuePlan: { status: string; total: number; plan: string };
};
