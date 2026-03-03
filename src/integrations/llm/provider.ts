import OpenAI from 'openai';
const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
export async function runLLM(prompt:string):Promise<string>{const mode=(process.env.LLM_MODE||'cloud').toLowerCase();if(mode==='local'){const res=await fetch('http://localhost:11434/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model:'llama3',prompt,stream:false})});if(!res.ok) throw new Error(`Ollama error: ${res.status}`);const data:any=await res.json();return String(data.response||'');}
const c=await openai.chat.completions.create({model:'gpt-4o-mini',messages:[{role:'user',content:prompt}]});return c.choices[0]?.message?.content||'';}
