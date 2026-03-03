import type { AgentPayload, AgentResult } from '@/core/orchestrator/types';
import { runLLM } from '@/integrations/llm/provider';
export async function architectAgent(payload:AgentPayload):Promise<AgentResult>{const summary=await runLLM(`You are a systems architect. Create a concise blueprint for: ${payload.objective}. Include modules, data model, deployment notes. Constraints: ${payload.constraints.join('; ')}`);return {agent:'architect',summary,artifacts:{deploymentMode:payload.deploymentMode}};}
