import crypto from"node:crypto";
const sessions=new Map();
const DEFAULT_TTL_MS=1000*60*60*24*30;
function normalizeId(value){return typeof value==="string"&&value.trim()?value.trim():""}
function hashToken(token){return crypto.createHash("sha256").update(token).digest("hex")}
export function createSession(accountId,token,now=()=>new Date().toISOString(),ttlMs=DEFAULT_TTL_MS){const id=normalizeId(accountId);if(!id)throw new Error("Account identity is required");if(typeof token!=="string"||!token.trim())throw new Error("Session token is required");const createdAt=now();const session={accountId:id,tokenHash:hashToken(token.trim()),createdAt,lastSeenAt:createdAt,expiresAt:new Date(new Date(createdAt).getTime()+ttlMs).toISOString()};sessions.set(session.tokenHash,session);return{accountId:session.accountId,createdAt:session.createdAt,lastSeenAt:session.lastSeenAt,expiresAt:session.expiresAt}}
export function resolveSession(token,now=()=>new Date().toISOString()){const key=typeof token==="string"?token.trim():"";if(!key)return null;const hash=hashToken(key);const session=sessions.get(hash);if(!session)return null;if(new Date(now()).getTime()>=new Date(session.expiresAt).getTime()){sessions.delete(hash);return null}session.lastSeenAt=now();return{accountId:session.accountId,createdAt:session.createdAt,lastSeenAt:session.lastSeenAt,expiresAt:session.expiresAt}}
export function revokeSession(token){const key=typeof token==="string"?token.trim():"";return key?sessions.delete(hashToken(key)):false}
export function clearSessions(){sessions.clear()}
export const SESSION_TTL_MS=DEFAULT_TTL_MS;
