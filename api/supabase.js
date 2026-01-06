const { createClient } = require('@supabase/supabase-js');

// Vercel / Production Environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // CRITICAL: Throw error to fail fast if env vars are missing
  // This will cause a 500 error, which is better than a silent failure
  throw new Error(`Missing Supabase Configuration! URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`);
}

console.log('✅ Initializing Supabase with URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;
