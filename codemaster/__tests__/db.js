import { createClient as createClient1 } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
//For some reasons .env variables are unableto be read so might need to use actual values here
export const supabase = createClient1(supabaseUrl,  supabaseAnonKey);