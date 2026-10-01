import{z}from"zod";
const syncEnvelopeSchema=z.object({formatVersion:z.literal(1),schemaVersion:z.number().int().positive(),revision:z.number().int().nonnegative(),deviceId:z.string().min(1).max(200),updatedAt:z.string().max(100),account:z.object({mode:z.string().max(20),userId:z.string().min(1).max(200)}),state:z.record(z.unknown())});
export const syncRequestSchema=z.object({accountId:z.string().trim().min(1).max(200),envelope:syncEnvelopeSchema});
export const contextSchema=z.record(z.unknown()).refine(value=>{try{return JSON.stringify(value).length<=12000}catch{return false}},"Context is too large");
export const goalSchema=z.object({goal:z.string().trim().min(3).max(1000),context:z.object({domain:z.string().max(100).optional(),constraints:z.array(z.string().max(500)).max(20).optional(),importantContext:z.array(z.string().max(500)).max(20).optional()}).optional()});
export const replanSchema=z.object({goal:z.string().trim().min(3).max(1000),context:contextSchema.optional()});
export const guideSchema=z.object({message:z.string().trim().min(1).max(4000),context:contextSchema.optional()});
