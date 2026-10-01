import{describe,it,expect,beforeEach,afterEach}from"vitest";
import{createApp}from"./server.js";
import{createMemoryDatabase}from"./memoryDatabase.js";
import{createSession,clearSessions}from"./session.js";

describe("sync HTTP boundary",()=>{
 let server,base;
 beforeEach(async()=>{clearSessions();const app=createApp(createMemoryDatabase());server=app.listen(0);await new Promise(resolve=>server.once("listening",resolve));base="http://127.0.0.1:"+server.address().port});
 afterEach(async()=>{clearSessions();if(server)await new Promise(resolve=>server.close(resolve))});
 const auth=()=>{createSession("account-1","test-token");return{Authorization:"Bearer test-token","Content-Type":"application/json"}};
 const envelope=(revision=1,state={goals:["g1"]})=>({formatVersion:1,schemaVersion:6,revision,deviceId:"device-1",updatedAt:"2026-10-01T00:00:00.000Z",account:{mode:"cloud",userId:"account-1"},state});
 it("rejects missing authentication",async()=>{const response=await fetch(base+"/api/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({envelope:envelope()})});expect(response.status).toBe(401)});
 it("pushes then pulls cloud state",async()=>{const headers=auth();let response=await fetch(base+"/api/sync",{method:"POST",headers,body:JSON.stringify({envelope:envelope()})});expect(response.status).toBe(200);const pushed=await response.json();expect(pushed.action).toBe("push");response=await fetch(base+"/api/sync",{headers:{"Authorization":"Bearer test-token"}});expect(response.status).toBe(200);const pulled=await response.json();expect(pulled.envelope.state).toEqual({goals:["g1"]})});
 it("returns a conflict for divergent equal revisions",async()=>{const headers=auth();await fetch(base+"/api/sync",{method:"POST",headers,body:JSON.stringify({envelope:envelope(2,{goals:["g1"]})})});const response=await fetch(base+"/api/sync",{method:"POST",headers,body:JSON.stringify({envelope:envelope(2,{goals:["g2"]})})});expect(response.status).toBe(409);const body=await response.json();expect(body.action).toBe("conflict")});
 it("pulls when the server has a newer revision",async()=>{const headers=auth();await fetch(base+"/api/sync",{method:"POST",headers,body:JSON.stringify({envelope:envelope(3)})});const response=await fetch(base+"/api/sync",{method:"POST",headers,body:JSON.stringify({envelope:envelope(1)})});expect(response.status).toBe(200);const body=await response.json();expect(body.action).toBe("pull");expect(body.envelope.revision).toBe(3)});
 it("rejects malformed JSON",async()=>{const response=await fetch(base+"/api/sync",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer bad"},body:"{"});expect(response.status).toBe(400)});
});