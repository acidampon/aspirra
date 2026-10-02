import{createClient}from"@supabase/supabase-js";
const url=import.meta.env.VITE_SUPABASE_URL||"";
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||"";
export const isSupabaseConfigured=Boolean(url&&key);
export const supabase=isSupabaseConfigured?createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
export async function getSupabaseSession(){if(!supabase)return null;const{data,error}=await supabase.auth.getSession();if(error)throw error;return data.session||null}
export function subscribeToAuth(callback){if(!supabase)return()=>{};const{data}=supabase.auth.onAuthStateChange((_event,session)=>callback(session));return()=>data.subscription.unsubscribe()}
export async function signInWithPassword(email,password){if(!supabase)throw new Error("Cloud account is not configured.");const{data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;return data.session}
export async function signUpWithPassword(email,password){if(!supabase)throw new Error("Cloud account is not configured.");const{data,error}=await supabase.auth.signUp({email,password});if(error)throw error;return data}
export async function signOutSupabase(){if(!supabase)return;const{error}=await supabase.auth.signOut();if(error)throw error}
