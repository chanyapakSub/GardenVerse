import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// This is prepared for future connection to Supabase (PostgreSQL)
// as mentioned in the architecture diagram for sensor_readings and other data.
export const supabase = createClient(supabaseUrl, supabaseKey);
