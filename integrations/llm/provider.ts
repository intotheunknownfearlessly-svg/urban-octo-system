import OpenAI from "openai";
import { env } from "@/config/env";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function runLLM(input: { system?: string; prompt: string }) {
  if (env.LLM_MODE === "ollama") {
    const res = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: env.OLLAMA_MODEL, prompt: `${input.system ? input.system + "\n\n" : ""}${input.prompt}` })
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
    const data = await res.json();
    return String(data.response ?? "");
  }

  if (!openai) throw new Error("OPENAI_API_KEY missing and LLM_MODE=openai");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      ...(input.system ? [{ role: "system" as const, content: input.system }] : []),
      { role: "user", content: input.prompt }
    ]
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function embed(text: string) {
  if (!openai) throw new Error("OPENAI_API_KEY missing for embeddings");
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  return r.data[0].embedding;
}
