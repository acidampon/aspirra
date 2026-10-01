export function createGoalRecord(plan){return{id:crypto.randomUUID(),title:plan.title,domain:plan.domain||"personal",description:plan.description||"",milestones:plan.milestones||[],source:plan.source||"local",status:"active",planVersion:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}
export function attachActions(actions,goalId){return actions.map((a,index)=>({...a,id:a.id||crypto.randomUUID(),goalId,milestone:a.milestone||Math.floor(index/3)+1,status:"open",createdAt:a.createdAt||new Date().toISOString()}))}
export function createPlanRevision(goal,reason){return{version:(goal.planVersion||1)+1,reason:reason.trim(),createdAt:new Date().toISOString()}}
export function archiveGoal(state,goalId){return updateGoalStatus(state,goalId,"archived")}
export function completeGoal(state,goalId){return updateGoalStatus(state,goalId,"completed")}
export function restoreGoal(state,goalId){return updateGoalStatus(state,goalId,"active")}
function updateGoalStatus(state,goalId,status){return{...state,goals:state.goals.map(g=>g.id===goalId?{...g,status,updatedAt:new Date().toISOString()}:g),activeGoalId:state.activeGoalId===goalId&&status!=="active"?"":state.activeGoalId}}