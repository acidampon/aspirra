import{normalizeAccount}from"./account.js";
export function createPostgresDatabase(pool){
  if(!pool||typeof pool.query!=="function")throw new Error("PostgreSQL database requires a query-capable pool");
  return{async health(){await pool.query("select 1");return true},
    async getAccount(id){
      const result=await pool.query("select id,email,mode,created_at as \"createdAt\",updated_at as \"updatedAt\" from aspirra_accounts where id=$1",[String(id)]);
      return result.rows[0]?normalizeAccount(result.rows[0]):null;
    },
    async saveAccount(account){
      const value=normalizeAccount(account);
      const result=await pool.query("insert into aspirra_accounts(id,email,mode,created_at,updated_at) values($1,$2,$3,$4,$5) on conflict(id) do update set email=excluded.email,mode=excluded.mode,updated_at=excluded.updated_at returning id,email,mode,created_at as \"createdAt\",updated_at as \"updatedAt\"",[value.id,value.email,value.mode,value.createdAt,value.updatedAt]);
      return normalizeAccount(result.rows[0]);
    },
    async getSnapshot(id){
      const result=await pool.query("select envelope from aspirra_sync_snapshots where account_id=$1",[String(id)]);
      return result.rows[0]?.envelope??null;
    },
    async saveSnapshot(snapshot){
      const accountId=String(snapshot.accountId||"");
      const envelope={...snapshot};delete envelope.accountId;
      await pool.query("insert into aspirra_sync_snapshots(account_id,format_version,schema_version,revision,device_id,updated_at,envelope) values($1,$2,$3,$4,$5,$6,$7) on conflict(account_id) do update set format_version=excluded.format_version,schema_version=excluded.schema_version,revision=excluded.revision,device_id=excluded.device_id,updated_at=excluded.updated_at,envelope=excluded.envelope",[accountId,envelope.formatVersion,envelope.schemaVersion,envelope.revision,envelope.deviceId,envelope.updatedAt,envelope]);
      return{...envelope,accountId};
    }
  };
}
