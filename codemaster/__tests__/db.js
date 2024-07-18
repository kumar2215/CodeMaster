import { createClient as createClient1 } from '@supabase/supabase-js';


//Issue with being unable to get env key value
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient1(supabaseUrl,  supabaseAnonKey);