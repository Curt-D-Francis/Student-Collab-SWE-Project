// src/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

// Make sure the variables are loaded properly
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key is missing.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
