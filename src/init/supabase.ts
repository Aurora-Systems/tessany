import { createClient } from "@supabase/supabase-js";
import { db_url, key } from "../db/keys";

const db = createClient(db_url,key) 

export default db