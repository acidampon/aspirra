import{describe,it,expect,beforeEach,afterEach,vi}from"vitest";
import{loadState,saveState}from"./storage";

describe("storage migration",()=>{
 const store=new Map();
 beforeEach(()=>{store.clear();vi.stubGlobal("localStorage",{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)});});
 afterEach(()=>vi.unstubAllGlobals());
 it("returns a clean v6 state when storage is empty",()=>{const state=loadState();expect(state.schemaVersion).toBe(6);expect(state.activeGoalId).toBe("");});
 it("migrates a legacy single-goal state and scopes actions to that goal",()=>{store.set("aspirra-state-v6",JSON.stringify({schemaVersion:5,goals:[{id:"g1",title:"Learn"}],actions:[{id:"a1",title:"Study"}]}));const state=loadState();expect(state.schemaVersion).toBe(6);expect(state.activeGoalId).toBe("g1");expect(state.goals[0].status).toBe("active");expect(state.goals[0].planVersion).toBe(1);expect(state.actions[0].goalId).toBe("g1");expect(state.actions[0].status).toBe("open");});
 it("preserves an explicit active goal and its version",()=>{store.set("aspirra-state-v6",JSON.stringify({schemaVersion:5,activeGoalId:"g2",goals:[{id:"g1",status:"archived"},{id:"g2",status:"active",planVersion:3}],actions:[]}));const state=loadState();expect(state.activeGoalId).toBe("g2");expect(state.goals[0].status).toBe("archived");expect(state.goals[1].planVersion).toBe(3);});
 it("recovers when the persisted active goal is archived or missing",()=>{store.set("aspirra-state-v6",JSON.stringify({schemaVersion:5,activeGoalId:"gone",goals:[{id:"g1",status:"archived"},{id:"g2",status:"active"}],actions:[]}));expect(loadState().activeGoalId).toBe("g2");store.set("aspirra-state-v6",JSON.stringify({schemaVersion:5,activeGoalId:"g1",goals:[{id:"g1",status:"archived"},{id:"g2",status:"active"}],actions:[]}));expect(loadState().activeGoalId).toBe("g2");});
 it("falls back to a clean state for malformed persisted JSON",()=>{store.set("aspirra-state-v6","{not-json");const state=loadState();expect(state.schemaVersion).toBe(6);expect(state.goals).toEqual([]);expect(state.activeGoalId).toBe("");});
 it("persists state with the current schema version",()=>{saveState({activeGoalId:"g1",goals:[],actions:[]});const saved=JSON.parse(store.get("aspirra-state-v6"));expect(saved.schemaVersion).toBe(6);expect(saved.activeGoalId).toBe("g1");});
});