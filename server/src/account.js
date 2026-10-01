const MODES=new Set(["local","cloud"]);
export function normalizeAccount(input={}){return{id:typeof input.id==="string"?input.id:"",email:typeof input.email==="string"?input.email:"",mode:MODES.has(input.mode)?input.mode:"local",createdAt:typeof input.createdAt==="string"?input.createdAt:"",updatedAt:typeof input.updatedAt==="string"?input.updatedAt:""}}
export function isSafeAccount(account){return Boolean(account&&typeof account.id==="string"&&typeof account.email==="string"&&MODES.has(account.mode))}
