import{buildIntelligence}from"./intelligence";
export function createStarterPlan(goalText){
  const intelligence=buildIntelligence(goalText),actions=intelligence.milestones.map((title,i)=>({id:crypto.randomUUID(),title,detail:i===0?intelligence.nextQuestion:"Turn this milestone into one visible action you can complete and record.",done:false,milestone:i+1}));
  return{title:intelligence.title,description:intelligence.summary,domain:intelligence.domain,milestones:intelligence.milestones,actions};
}