import{describe,expect,it}from"vitest";
import{hasRemoteAI}from"./api";
describe("AI API client",()=>{
  it("exports a remote AI availability check",()=>{expect(typeof hasRemoteAI()).toBe("boolean")})
});
