import"dotenv/config";import express from"express";import cors from"cors";import{z}from"zod";import{generatePlan,replanGoal,chatWithGuide}from"./ai.js";
export const app=express();
const allowedOrigin=process.env.FRONTEND_ORIGIN;
app.use(cors(allowedOrigin?{origin:allowedOrigin}:{}));
app.use(express.json({limit:"100kb"}));
const requestCounts=new Map();
const WINDOW_MS=60_000;
const MAX_REQUESTS=30;
function rateLimit(req,res,next){const now=Date.now();const key=req.ip||"unknown";const current=requestCounts.get(key);if(!current||now-current.startedAt>=WINDOW_MS){requestCounts.set(key,{startedAt:now,count:1});return next()}if(current.count>=MAX_REQUESTS)return res.status(429).json({error:"Too many requests. Please try again shortly."});current.count+=1;next()}
app.use("/api",rateLimit);
app.get("/health",(_,res)=>res.json({ok:true,service:"aspirra-server",version:"0.1.0"}));
const contextSchema=z.record(z.unknown()).refine(value=>{try{return JSON.stringify(value).length<=12000}catch{return false}},"Context is too large");
export const goalSchema=z.object({goal:z.string().trim().min(3).max(1000),context:z.object({domain:z.string().max(100).optional(),constraints:z.array(z.string().max(500)).max(20).optional(),importantContext:z.array(z.string().max(500)).max(20).optional()}).optional()});
export const replanSchema=z.object({goal:z.string().trim().min(3).max(1000),context:contextSchema.optional()});
export const guideSchema=z.object({message:z.string().trim().min(1).max(4000),context:contextSchema.optional()});
function handleError(res,error){console.error("Aspirra API error:",error instanceof Error?error.message:"unknown");return res.status(502).json({error:"Aspirra AI service is temporarily unavailable."})}
app.post("/api/plan",async(req,res)=>{const parsed=goalSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid goal request"});try{res.json(await generatePlan(parsed.data))}catch(error){handleError(res,error)}});
app.post("/api/replan",async(req,res)=>{const parsed=replanSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid replan request"});try{res.json(await replanGoal(parsed.data))}catch(error){handleError(res,error)}});
app.post("/api/guide",async(req,res)=>{const parsed=guideSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid guide request"});try{res.json(await chatWithGuide(parsed.data))}catch(error){handleError(res,error)}});
const port=Number(process.env.PORT||8787);
if(process.env.NODE_ENV!=="test")app.listen(port,()=>console.log("Aspirra server listening on "+port));