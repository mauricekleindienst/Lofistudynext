const { createClient } = require('@supabase/supabase-js')

async function createMissingTables() {
  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log('🔗 Connected to Supabase database')

  try {
    // Try to create the pomodoro_sessions table
    console.log('📋 Creating pomodoro_sessions table...')
    
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

      -- Enable RLS
      ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY IF NOT EXISTS "Users can view own pomodoro sessions" ON pomodoro_sessions
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY IF NOT EXISTS "Users can insert own pomodoro sessions" ON pomodoro_sessions
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY IF NOT EXISTS "Users can update own pomodoro sessions" ON pomodoro_sessions
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY IF NOT EXISTS "Users can delete own pomodoro sessions" ON pomodoro_sessions
        FOR DELETE USING (auth.uid() = user_id);

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_pomodoro_sessions_updated_at ON pomodoro_sessions;
      CREATE TRIGGER update_pomodoro_sessions_updated_at 
        BEFORE UPDATE ON pomodoro_sessions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    // Execute the SQL directly
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    })

    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // Try alternative approach - test if table already exists
      console.log('🧪 Testing if pomodoro_sessions already exists...')
      const { data: testData, error: testError } = await supabase
        .from('pomodoro_sessions')
        .select('id')
        .limit(1)
      
      if (testError) {
        if (testError.code === '42P01') {
          console.log('❌ Table does not exist and could not be created')
          console.log('💡 Please create the table manually in the Supabase dashboard')
          console.log('📋 SQL to run:')
          console.log(createTableSQL)
        } else {
          console.error('❌ Other error:', testError)
        }
      } else {
        console.log('✅ pomodoro_sessions table already exists and is accessible')
      }
    } else {
      console.log('✅ SQL executed successfully')
      console.log('📊 Result:', data)
    }

    // Test database connection with a simple query
    console.log('🧪 Testing database connection...')
    const { data: authCheck, error: authError } = await supabase.auth.getSession()
    console.log('🔐 Auth status:', authError ? 'Error' : 'Connected')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Run the setup
createMissingTables()
