import OpenAI from 'openai';
import { supabaseServer } from '@/integrations/supabase/server';
const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
export async function saveMemory(agent:string,content:string){let embedding:null|number[]=null;if(process.env.OPENAI_API_KEY){const emb=await openai.embeddings.create({model:'text-embedding-3-small',input:content});embedding=emb.data[0].embedding as any;}await supabaseServer.from('agent_memory').insert({agent,content,embedding});}
export async function getRecentMemory(agent:string,limit=5){const {data}=await supabaseServer.from('agent_memory').select('id,agent,content,created_at').eq('agent',agent).order('created_at',{ascending:false}).limit(limit);return data??[];}
