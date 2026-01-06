const { createClient } = require('@supabase/supabase-js');

// 您的配置
const SUPABASE_URL = 'https://hogpxvwutshsqwesxbpn.supabase.co';
// 请把您的 Service Key 填在这里 (不要用 Anon Key)
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3B4dnd1dHNoc3F3ZXN4YnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzcxMzY1MiwiZXhwIjoyMDc5Mjg5NjUyfQ.VHEkcjCF5KflmXwiXrYHMkHL2YPGZPTVPrPdVXuen2k';

console.log('Testing connection to:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

async function test() {
  try {
    console.log('1. Checking connection by listing tables...');
    // 这是一个特殊的查询，用来列出所有表名 (如果不成功说明连接有问题)
    const { data: tables, error: tableError } = await supabase
      .from('valentia_applications')
      .select('count', { count: 'exact', head: true });
      
    if (tableError) {
      console.error('❌ Connection/Table Error:', tableError);
      return;
    }
    console.log('✅ Connection OK. Current rows in table:', tables);

    console.log('2. Attempting to insert test record...');
    
    const { data, error } = await supabase
      .from('valentia_applications')
      .insert([{
        full_name: 'Test Script User',
        email: 'test-script@example.com',
        phone: '999999999',
        course: 'Test Course',
        status: 'pending',
        language: 'en',
        application_id: 'TEST-' + Date.now()
      }])
      .select();

    if (error) {
      console.error('❌ Insert Failed:', error);
    } else {
      console.log('✅ Insert Success! Data:', data);
      console.log('👉 Please check your Supabase Dashboard NOW.');
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err);
  }
}

test();
