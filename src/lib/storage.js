const KEY="aspirra-state-v2";
const initialState={goals:[],actions:[],completedActionIds:[],onboardingComplete:false,reflections:[],blockers:[],memory:{preferences:[],constraints:[],importantContext:[]}};
export function loadState(){try{const raw=localStorage.getItem(KEY);if(!raw)return initialState;const parsed=JSON.parse(raw);return{...initialState,...parsed,memory:{...initialState.memory,...(parsed.memory||{})}}}catch{return initialState}}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}