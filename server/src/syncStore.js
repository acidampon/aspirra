const records=new Map();
function key(accountId){return String(accountId||"").trim()}
export function getSyncRecord(accountId){const record=records.get(key(accountId));return record?structuredClone(record):null}
export function putSyncRecord(accountId,envelope){records.set(key(accountId),structuredClone(envelope));return structuredClone(envelope)}
export function clearSyncStore(){records.clear()}
