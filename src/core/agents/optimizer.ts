import type { AgentPayload, AgentResult } from '@/core/orchestrator/types';
import { runLLM } from '@/integrations/llm/provider';
export async function optimizerAgent(payload:AgentPayload,_ctx:Record<string,AgentResult>):Promise<AgentResult>{const summary=await runLLM(`You are a conversion optimizer. Propose highest-leverage improvements for: ${payload.objective}. Include telemetry gaps and A/B tests. Keep compliant and opt-in.`);return {agent:'optimizer',summary};}
