const KEY="aspirra-state-v3";
const initialState={goals:[],actions:[],completedActionIds:[],onboardingComplete:false,reflections:[],blockers:[],evidence:[],memory:{preferences:[],constraints:[],importantContext:[]}};
function migrate(parsed){return{...initialState,...parsed,actions:(parsed.actions||[]).map(a=>({...a,goalId:a.goalId||((parsed.goals||[]).length===1?(parsed.goals||[])[0].id:undefined)})),evidence:parsed.evidence||[],memory:{...initialState.memory,...(parsed.memory||{})}}}
export function loadState(){try{const raw=localStorage.getItem(KEY);if(!raw)return initialState;return migrate(JSON.parse(raw))}catch{return initialState}}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}