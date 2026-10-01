import"dotenv/config";import express from"express";import cors from"cors";import{z}from"zod";import{Pool}from"pg";import{resolveSession}from"./session.js";
import{createMemoryDatabase}from"./memoryDatabase.js";
import{createSyncService}from"./syncService.js";import{createPostgresDatabase}from"./postgresDatabase.js";
import{syncRequestSchema,goalSchema,replanSchema,guideSchema}from"./schemas.js";
function createConfiguredDatabase(){if(process.env.DATABASE_URL){return createPostgresDatabase(new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==="true"?{rejectUnauthorized:false}:undefined}))}return createMemoryDatabase()}
function createApp(database=createConfiguredDatabase()){const app=express();
const allowedOrigin=process.env.FRONTEND_ORIGIN;const production=process.env.NODE_ENV==="production";if(production&&!allowedOrigin)throw new Error("FRONTEND_ORIGIN is required in production");
const syncService=createSyncService(database);app.locals.databaseHealth=typeof database.health==="function"?database.health:undefined;
app.use(cors(allowedOrigin?{origin:allowedOrigin}:{}));
app.use(express.json({limit:"100kb"}));
const requestCounts=new Map();
const WINDOW_MS=60_000;
const MAX_REQUESTS=30;
const MAX_TRACKED_CLIENTS=10_000;
function rateLimit(req,res,next){const now=Date.now();const key=req.ip||"unknown";const current=requestCounts.get(key);if(!current||now-current.startedAt>=WINDOW_MS){if(requestCounts.size>=MAX_TRACKED_CLIENTS){for(const [client,entry] of requestCounts){if(now-entry.startedAt>=WINDOW_MS)requestCounts.delete(client)}if(requestCounts.size>=MAX_TRACKED_CLIENTS)return res.status(429).json({error:"Too many clients. Please try again shortly."})}requestCounts.set(key,{startedAt:now,count:1});return next()}if(current.count>=MAX_REQUESTS)return res.status(429).json({error:"Too many requests. Please try again shortly."});current.count+=1;next()}
app.use("/api",rateLimit);
app.get("/health",async(_,res)=>{let database="memory";if(process.env.DATABASE_URL){database="postgres";try{await app.locals.databaseHealth?.();}catch{return res.status(503).json({ok:false,service:"aspirra-server",version:"0.1.0",database:"unavailable"})}}res.json({ok:true,service:"aspirra-server",version:"0.1.0",database})});app.post("/api/sync",async(req,res)=>{const parsed=syncRequestSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid sync request"});const session=resolveSession(req.headers.authorization?.replace(/^Bearer\s+/i,""));if(!session)return res.status(401).json({error:"Authentication required"});const accountId=session.accountId;const incoming=parsed.data.envelope;const current=await syncService.get(session.accountId);if(!current){await syncService.put(session.accountId,incoming);return res.json({status:"accepted",action:"push",envelope:incoming})}if(incoming.revision>current.revision){await syncService.put(session.accountId,incoming);return res.json({status:"accepted",action:"push",envelope:incoming})}if(incoming.revision<current.revision)return res.json({status:"available",action:"pull",envelope:current});if(JSON.stringify(incoming.state)===JSON.stringify(current.state))return res.json({status:"synced",action:"noop",envelope:current});return res.status(409).json({error:"Sync conflict requires review",action:"conflict",local:incoming,remote:current});});

function handleError(res,error){console.error("Aspirra API error:",error instanceof Error?error.message:"unknown");return res.status(502).json({error:"Aspirra AI service is temporarily unavailable."})}
app.post("/api/plan",async(req,res)=>{const parsed=goalSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid goal request"});try{const{generatePlan}=await import("./ai.js");res.json(await generatePlan(parsed.data))}catch(error){handleError(res,error)}});
app.post("/api/replan",async(req,res)=>{const parsed=replanSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid replan request"});try{const{replanGoal}=await import("./ai.js");res.json(await replanGoal(parsed.data))}catch(error){handleError(res,error)}});
app.post("/api/guide",async(req,res)=>{const parsed=guideSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid guide request"});try{const{chatWithGuide}=await import("./ai.js");res.json(await chatWithGuide(parsed.data))}catch(error){handleError(res,error)}});
return app}
export const app=createApp();
const port=Number(process.env.PORT||8787);
if(process.env.NODE_ENV!=="test")app.listen(port,()=>console.log("Aspirra server listening on "+port));