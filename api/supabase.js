const { createClient } = require('@supabase/supabase-js');

// Only load dotenv locally
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '../server/.env') });
  } catch (e) {
    console.warn('Dotenv not found or failed to load');
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase;

try {
  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_SERVICE_KEY');
    throw new Error(`Missing Environment Variables: ${missing.join(', ')}`);
  }

  console.log('✅ Initializing Supabase with URL:', supabaseUrl);
  
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} catch (error) {
  console.error('❌ CRITICAL: Supabase Initialization Failed:', error.message);
  
  // Create a Mock Client that returns errors instead of crashing
  // This allows the server to start and return the error to the frontend
  const mockError = { error: { message: `Backend Configuration Error: ${error.message}` }, data: null };
  const mockChain = () => ({ 
    select: () => Promise.resolve(mockError),
    insert: () => Promise.resolve(mockError),
    update: () => Promise.resolve(mockError),
    delete: () => Promise.resolve(mockError),
    eq: () => mockChain(),
    single: () => Promise.resolve(mockError),
    limit: () => mockChain(),
    order: () => mockChain(),
    range: () => mockChain(),
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
    // Attach the init error so we can check it
    _initError: error.message
  };
}

module.exports = supabase;
