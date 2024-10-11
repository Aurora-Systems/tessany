import { createClient } from "@supabase/supabase-js";

const s_url =  import.meta.env.VITE_SUPABASE_URL
const s_key = import.meta.env.VITE_SUPABASE_KEY
const db = createClient(s_url, s_key) 

export default db