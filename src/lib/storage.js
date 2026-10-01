const KEY="aspirra-state-v1";
const initialState={goals:[],actions:[],completedActionIds:[],onboardingComplete:false};
export function loadState(){try{const raw=localStorage.getItem(KEY);return raw?{...initialState,...JSON.parse(raw)}:initialState}catch{return initialState}}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}