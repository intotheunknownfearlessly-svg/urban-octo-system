import type { AgentPayload, AgentResult } from '@/core/orchestrator/types';
import { runLLM } from '@/integrations/llm/provider';
export async function builderAgent(payload:AgentPayload,_a?:AgentResult,_r?:AgentResult):Promise<AgentResult>{const summary=await runLLM(`You are a build planner. Produce an ordered implementation task list for: ${payload.objective}. Include Stripe, Supabase schema, telemetry, deployment.`);return {agent:'builder',summary};}
