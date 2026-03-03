import type { AgentPayload, AgentResult } from '@/core/orchestrator/types';
import { runLLM } from '@/integrations/llm/provider';
export async function revenueAgent(payload:AgentPayload,_a?:AgentResult):Promise<AgentResult>{const summary=await runLLM(`You are a revenue strategist. For: ${payload.objective}, create pricing tiers, offer stack, funnel steps. Target: ${payload.revenueTarget??'unspecified'}. Constraints: ${payload.constraints.join('; ')}`);return {agent:'revenue',summary};}
