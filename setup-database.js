const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function setupDatabase() {
  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log('🔗 Connected to Supabase database')

  try {
    // Check if pomodoro_sessions table exists
    console.log('📋 Checking existing tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError)
      return
    }

    const tableNames = tables.map(t => t.table_name)
    console.log('📊 Existing tables:', tableNames)

    // Check if pomodoro_sessions exists
    if (!tableNames.includes('pomodoro_sessions')) {
      console.log('⚠️ pomodoro_sessions table missing, creating...')
      
      // Create pomodoro_sessions table using SQL
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          email VARCHAR(255) NOT NULL,
          duration INTEGER DEFAULT 25,
          completed BOOLEAN DEFAULT FALSE,
          started_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      
      if (createError) {
        console.error('❌ Error creating table:', createError)
        return
      }
      
      console.log('✅ pomodoro_sessions table created successfully')

      // Enable RLS
      const enableRLSSQL = 'ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;'
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL })
      
      if (rlsError) {
        console.error('⚠️ Warning: Could not enable RLS:', rlsError)
      } else {
        console.log('🔒 RLS enabled for pomodoro_sessions')
      }

    } else {
      console.log('✅ pomodoro_sessions table already exists')
    }

    // Test the pomodoro API by checking if we can query it
    console.log('🧪 Testing pomodoro_sessions table access...')
    const { count, error: countError } = await supabase
      .from('pomodoro_sessions')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error accessing pomodoro_sessions:', countError)
    } else {
      console.log(`✅ pomodoro_sessions table accessible, found ${count} records`)
    }

    console.log('🎉 Database setup completed successfully!')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Run the setup
setupDatabase()
