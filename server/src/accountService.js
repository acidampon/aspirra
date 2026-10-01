import{normalizeAccount,isSafeAccount}from"./account.js";
export function createAccountService(database){
  if(!database||typeof database.getAccount!=="function"||typeof database.saveAccount!=="function")throw new Error("Account service requires a database adapter");
  return{
    async get(id){const account=await database.getAccount(id);return account?normalizeAccount(account):null},
    async save(input){const account=normalizeAccount(input);if(!account.id||!isSafeAccount(account))throw new Error("Invalid account");const now=new Date().toISOString();const next={...account,updatedAt:account.updatedAt||now,createdAt:account.createdAt||now};const saved=await database.saveAccount(next);return normalizeAccount(saved||next)}
  }
}
