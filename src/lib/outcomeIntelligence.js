function daysAgo(date){const t=new Date(date||0).getTime();return Number.isFinite(t)?(Date.now()-t)/86400000:Infinity}
function goalText(goal){return [goal?.title,goal?.description].filter(Boolean).join(" ").trim()}
function outcomeClarity(goal){const text=goalText(goal);if(!text)return 0;let score=40;if(text.length>=45)score+=15;if(/\b(by|within|before|until|deadline|month|week|year)\b/i.test(text))score+=15;if(/\b(to|so that|because|for)\b/i.test(text))score+=10;if(/\d/.test(text))score+=10;return Math.min(score,100)}
export function analyzeOutcome(state,goalId){
 const goal=(state.goals||[]).find(g=>g.id===goalId);if(!goal)return null;
 const actions=(state.actions||[]).filter(a=>a.goalId===goalId&&a.status!=="archived"),completedIds=new Set(state.completedActionIds||[]);
 const completedActionIds=new Set(actions.filter(a=>completedIds.has(a.id)).map(a=>a.id));
 const open=actions.filter(a=>!completedIds.has(a.id));
 const completionEvents=(state.actionEvents||[]).filter(e=>e.type==="completed"&&completedActionIds.has(e.actionId));
 const recentEvents=completionEvents.filter(e=>daysAgo(e.createdAt)<=7);
 const evidence=(state.evidence||[]).filter(e=>e.goalId===goalId),recentEvidence=evidence.filter(e=>daysAgo(e.createdAt)<=14);
 const blockers=(state.blockers||[]).filter(b=>b.goalId===goalId);
 const deferralCounts=(state.deferredActions||[]).filter(d=>actions.some(a=>a.id===d.actionId)).reduce((m,d)=>(m[d.actionId]=(m[d.actionId]||0)+1,m),{});
 const repeatedlyDeferred=open.filter(a=>(deferralCounts[a.id]||0)>=2);
 const progress=actions.length?Math.round(completedActionIds.size/actions.length*100):0,clarity=outcomeClarity(goal);
 let diagnosis="The outcome has a workable starting point. Keep the next action small and observable.",type="steady",recommendation=open[0]?.title||"Define the smallest next action.";
 if(!actions.length){type="undefined";diagnosis="The outcome exists, but there is no concrete path to act on yet.";recommendation="Create one small action that would make the outcome measurably closer."}
 else if(repeatedlyDeferred.length){type="friction";diagnosis="The plan is meeting friction. A repeatedly deferred action is evidence that the current step may be too large, mistimed, or poorly matched to the constraint.";recommendation="Shrink or redesign: "+repeatedlyDeferred[0].title}
 else if(recentEvents.length===0&&open.length){type="stalled";diagnosis="The outcome has unfinished work but no completion signal in the last 7 days. The immediate problem is execution, not adding more planning.";recommendation="Complete the smallest unfinished action today and record evidence."}
 else if(recentEvents.length>0&&recentEvidence.length===0){type="evidence";diagnosis="Actions are moving, but Aspirra has little recent evidence about what actually happened. Stronger evidence will improve the next adjustment.";recommendation="Record what changed after the next completed action."}
 else if(open.length===0){type="milestone";diagnosis="The current action path is complete. The next decision is whether the outcome itself is complete or needs a new milestone.";recommendation="Review the outcome and define the next milestone if it is not finished."}
 else if(clarity<55){type="clarity";diagnosis="The intention is understandable, but the outcome could be more specific. A clearer target makes planning and progress signals more useful.";recommendation="Rewrite the outcome so success can be recognized without guessing."}
 return{goalId,title:goal.title,type,diagnosis,recommendation,clarity,progress,openActions:open.length,completedActions:completedActionIds.size,recentEvents:recentEvents.length,recentEvidence:recentEvidence.length,repeatedDeferrals:repeatedlyDeferred.length,blockers:blockers.length}
}