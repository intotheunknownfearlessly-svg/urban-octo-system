import { runLLM } from "@/integrations/llm/provider";

export async function runLaunchPipeline(objective: string) {
  const market = await runLLM({
    system: "You are a ruthless direct-response strategist. Output concise, structured blocks.",
    prompt: `Define ICP + positioning + channel plan for: ${objective}`
  });

  const offer = await runLLM({
    system: "You are a pricing and offer architect. Output pricing tiers and upsell logic.",
    prompt: `Design offer + pricing + upsell for: ${objective}`
  });

  const copy = await runLLM({
    system: "You write high-converting landing pages. Output sectioned copy.",
    prompt: `Write landing page copy for the offer designed above. Include: hero, bullets, proof, pricing, FAQs, CTA.`
  });

  return { market, offer, copy };
}
