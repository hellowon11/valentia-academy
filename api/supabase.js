const { createClient } = require('@supabase/supabase-js');

// Vercel / Production Environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase Env Vars Missing');
  // Create a dummy client to prevent crash during import
  const mockError = { error: { message: 'Backend Configuration Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in Vercel Settings' }, data: null };
  const mockChain = () => ({ 
    select: () => Promise.resolve(mockError),
    insert: () => Promise.resolve(mockError),
    update: () => Promise.resolve(mockError),
    delete: () => Promise.resolve(mockError),
    eq: () => mockChain(),
    single: () => Promise.resolve(mockError),
    limit: () => mockChain(),
    order: () => mockChain(),
    in: () => mockChain()
  });

  supabase = {
    from: () => mockChain(),
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockError),
        createSignedUrl: () => Promise.resolve(mockError),
        remove: () => Promise.resolve(mockError)
      })
    },
    _initError: true
  };
} else {
  // Valid Initialization
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

module.exports = supabase;
