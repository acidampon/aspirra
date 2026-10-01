const API_BASE=(import.meta.env.VITE_API_URL||"").replace(/\/$/,"");
async function request(path,body){const response=await fetch(API_BASE+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||"Aspirra service unavailable");return data}
export function requestAIPlan(goal,context){return request("/api/plan",{goal,context})}
export function requestAIGuide(message,context){return request("/api/guide",{message,context})}
export function hasRemoteAI(){return Boolean(API_BASE)}