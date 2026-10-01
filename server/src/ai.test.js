import{describe,expect,it}from"vitest";
import{goalSchema,replanSchema,guideSchema}from"./server.js";
describe("AI server contract",()=>{
 it("accepts a valid planning request",()=>{expect(goalSchema.safeParse({goal:"Get a new job",context:{domain:"career",constraints:["limited time"]}}).success).toBe(true)});
 it("rejects oversized guide messages",()=>{expect(guideSchema.safeParse({message:"x".repeat(4001)}).success).toBe(false)});
 it("rejects oversized replan context",()=>{expect(replanSchema.safeParse({goal:"Improve my career",context:{payload:"x".repeat(12001)}}).success).toBe(false)});
 it("rejects oversized planning context arrays",()=>{expect(goalSchema.safeParse({goal:"Learn a skill",context:{constraints:Array.from({length:21},()=> "constraint")}}).success).toBe(false)});
});