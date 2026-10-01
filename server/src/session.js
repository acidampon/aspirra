const sessions=new Map();
function normalizeId(value){return typeof value==="string"&&value.trim()?value.trim():""}
export function createSession(accountId,token,now=()=>new Date().toISOString()){const id=normalizeId(accountId);if(!id)throw new Error("Account identity is required");if(typeof token!=="string"||!token.trim())throw new Error("Session token is required");const session={accountId:id,token:token.trim(),createdAt:now(),lastSeenAt:now()};sessions.set(session.token,session);return{accountId:session.accountId,createdAt:session.createdAt,lastSeenAt:session.lastSeenAt}}
export function resolveSession(token,now=()=>new Date().toISOString()){const key=typeof token==="string"?token.trim():"";const session=sessions.get(key);if(!session)return null;session.lastSeenAt=now();return{accountId:session.accountId,createdAt:session.createdAt,lastSeenAt:session.lastSeenAt}}
export function revokeSession(token){return sessions.delete(typeof token==="string"?token.trim():"")}
export function clearSessions(){sessions.clear()}
