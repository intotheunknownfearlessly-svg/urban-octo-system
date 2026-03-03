import { runLLM } from "@/integrations/llm/provider";

export async function generateSaaS(niche: string) {
  const concept = await runLLM({
    system: "You generate SaaS businesses. Output concise structured JSON only.",
    prompt: `Niche: ${niche}
Return JSON with keys: concept, features, pricing, goToMarket, risks.`
  });

  try {
    return JSON.parse(concept);
  } catch {
    return { concept };
  }
}
