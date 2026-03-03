import { runLLM } from '@/integrations/llm/provider';
import { saveMemory } from '@/core/memory/store';
export async function runLaunchPipeline(objective:string){const market=await runLLM(`Define ICP + market framing for: ${objective}`);const offer=await runLLM(`Create an offer + positioning + pricing options for: ${objective}`);const copy=await runLLM(`Write landing page copy (hero, bullets, CTA, FAQs) for: ${objective}`);await saveMemory('launch_engine',[market,offer,copy].join('\n\n'));return {market,offer,copy};}
