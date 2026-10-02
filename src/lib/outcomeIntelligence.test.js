import {describe,expect,it} from "vitest";
import {analyzeOutcome} from "./outcomeIntelligence";

const ago=(days)=>new Date(Date.now()-days*86400000).toISOString();
const base=(overrides={})=>({
 goals:[{id:"g1",title:"Build a sustainable career plan",description:"Secure a new role within 6 months"}],
 actions:[{id:"a1",goalId:"g1",title:"Send one application",status:"active"},{id:"a2",goalId:"g1",title:"Review one job listing",status:"active"}],
 completedActionIds:[],
 actionEvents:[],
 evidence:[],
 deferredActions:[],
 blockers:[],
 ...overrides
});

describe("outcome intelligence",()=>{
 it("detects repeated friction instead of treating deferral as failure",()=>{
   const result=analyzeOutcome(base({deferredActions:[
     {id:"d1",actionId:"a1",date:ago(1),createdAt:ago(1),reason:"No time"},
     {id:"d2",actionId:"a1",date:ago(2),createdAt:ago(2),reason:"Too large"}
   ]}),"g1");
   expect(result.type).toBe("friction");
   expect(result.repeatedDeferrals).toBe(1);
 });
 it("uses unique completed actions for progress",()=>{
   const result=analyzeOutcome(base({
     completedActionIds:["a1"],
     actionEvents:[
       {id:"e1",actionId:"a1",type:"completed",createdAt:ago(1)},
       {id:"e2",actionId:"a1",type:"completed",createdAt:ago(1)}
     ]
   }),"g1");
   expect(result.progress).toBe(50);
   expect(result.completedActions).toBe(1);
   expect(result.recentEvents).toBe(2);
 });
 it("recognizes movement without evidence",()=>{
   const result=analyzeOutcome(base({
     completedActionIds:["a1"],
     actionEvents:[{id:"e1",actionId:"a1",type:"completed",createdAt:ago(1)}]
   }),"g1");
   expect(result.type).toBe("evidence");
 });
 it("recognizes a completed action path as a milestone",()=>{
   const result=analyzeOutcome(base({
     completedActionIds:["a1","a2"],
     actionEvents:[
       {id:"e1",actionId:"a1",type:"completed",createdAt:ago(2)},
       {id:"e2",actionId:"a2",type:"completed",createdAt:ago(2)}
     ],
     evidence:[{id:"ev1",goalId:"g1",createdAt:ago(2),text:"Completed both planned steps"}]
   }),"g1");
   expect(result.type).toBe("milestone");
   expect(result.progress).toBe(100);
 });
});