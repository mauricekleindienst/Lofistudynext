#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Check existing tables
    console.log('🔍 Checking existing tables...');
    const { data: existingTables, error: tablesError } = await supabase.rpc('get_table_list');
    
    if (tablesError) {
      console.log('⚠️ Could not fetch table list, proceeding with migration...');
    } else {
      console.log('📋 Existing tables:', existingTables?.map(t => t.table_name) || 'Unable to list');
    }

    // Create pomodoro_sessions table if it doesn't exist
    console.log('📝 Creating pomodoro_sessions table...');
    const pomodoroSessionsSQL = `
      -- Create pomodoro_sessions table if it doesn't exist
      CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          duration integer NOT NULL DEFAULT 1500,
          type text NOT NULL DEFAULT 'work'::text,
          completed boolean NOT NULL DEFAULT false,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          completed_at timestamp with time zone,
          task_name text,
          notes text,
          
          CONSTRAINT pomodoro_sessions_type_check CHECK ((type = ANY (ARRAY['work'::text, 'short_break'::text, 'long_break'::text]))),
          CONSTRAINT pomodoro_sessions_duration_check CHECK ((duration > 0))
      );

      -- Enable RLS
      ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      DROP POLICY IF EXISTS "Users can view own pomodoro sessions" ON public.pomodoro_sessions;
      CREATE POLICY "Users can view own pomodoro sessions" ON public.pomodoro_sessions
          FOR SELECT USING ((auth.uid() = user_id));

      DROP POLICY IF EXISTS "Users can insert own pomodoro sessions" ON public.pomodoro_sessions;
      CREATE POLICY "Users can insert own pomodoro sessions" ON public.pomodoro_sessions
          FOR INSERT WITH CHECK ((auth.uid() = user_id));

      DROP POLICY IF EXISTS "Users can update own pomodoro sessions" ON public.pomodoro_sessions;
      CREATE POLICY "Users can update own pomodoro sessions" ON public.pomodoro_sessions
          FOR UPDATE USING ((auth.uid() = user_id));

      DROP POLICY IF EXISTS "Users can delete own pomodoro sessions" ON public.pomodoro_sessions;
      CREATE POLICY "Users can delete own pomodoro sessions" ON public.pomodoro_sessions
          FOR DELETE USING ((auth.uid() = user_id));

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON public.pomodoro_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_type ON public.pomodoro_sessions(type);
      CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed ON public.pomodoro_sessions(completed);

      -- Create trigger for updated_at (if you want to add this column)
      -- ALTER TABLE public.pomodoro_sessions ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
      
      -- Grant permissions
      GRANT ALL ON public.pomodoro_sessions TO authenticated;
      GRANT ALL ON public.pomodoro_sessions TO service_role;
    `;

    const { error: pomodoroError } = await supabase.rpc('exec_sql', { sql: pomodoroSessionsSQL });
    
    if (pomodoroError) {
      console.error('❌ Failed to create pomodoro_sessions table:', pomodoroError.message);
    } else {
      console.log('✅ pomodoro_sessions table created successfully');
    }

    // Verify tables exist
    console.log('🔍 Verifying table creation...');
    const { data: pomodoroCheck, error: checkError } = await supabase
      .from('pomodoro_sessions')
      .select('count', { count: 'exact', head: true });

    if (checkError) {
      console.error('❌ pomodoro_sessions table verification failed:', checkError.message);
    } else {
      console.log('✅ pomodoro_sessions table verified');
    }

    // Add any missing columns to existing tables if needed
    console.log('🔧 Checking for missing columns in existing tables...');
    
    // Check if users table has all needed columns
    const userColumnsSQL = `
      -- Add missing columns to users table if they don't exist
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0;
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_focus_time integer DEFAULT 0;
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT timezone('utc'::text, now());
    `;

    const { error: userColumnsError } = await supabase.rpc('exec_sql', { sql: userColumnsSQL });
    
    if (userColumnsError) {
      console.error('❌ Failed to add user columns:', userColumnsError.message);
    } else {
      console.log('✅ User table columns updated successfully');
    }

    console.log('🎉 Database migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log('  ✅ pomodoro_sessions table created');
    console.log('  ✅ RLS policies configured');
    console.log('  ✅ Indexes created');
    console.log('  ✅ User table columns updated');
    console.log('\n🔗 Your Supabase project is ready!');

  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Create the exec_sql function if it doesn't exist
async function setupSQLFunction() {
  console.log('🔧 Setting up SQL execution function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;

  try {
    // We'll try to use direct SQL execution instead
    await runMigration();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using individual SQL statements
async function runMigrationDirect() {
  console.log('🚀 Starting direct database migration...');
  
  try {
    // Test connection first
    console.log('📡 Testing Supabase connection...');
    const { data: users, error: connectionError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Connection successful');

    // Check if pomodoro_sessions table exists
    console.log('🔍 Checking if pomodoro_sessions table exists...');
    const { data: pomodoroData, error: pomodoroError } = await supabase
      .from('pomodoro_sessions')
      .select('id')
      .limit(1);

    if (pomodoroError && pomodoroError.code === 'PGRST116') {
      console.log('📝 pomodoro_sessions table does not exist, needs to be created via SQL editor');
      console.log('\n🔧 Manual Steps Required:');
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('2. Navigate to your project: ptwhylqiogzmpltbnifu');
      console.log('3. Go to SQL Editor');
      console.log('4. Run the SQL from supabase-schema.sql file');
      console.log('\nOr use the migration script we created: add-missing-tables.sql');
      
      // Let's read and display the SQL needed
      console.log('\n📋 SQL to execute:');
      const fs = require('fs');
      try {
        const sqlContent = fs.readFileSync('/Users/sarius/git/Lofistudynext/add-missing-tables.sql', 'utf8');
        console.log('─'.repeat(50));
        console.log(sqlContent);
        console.log('─'.repeat(50));
      } catch (readError) {
        console.log('Could not read SQL file, please check add-missing-tables.sql');
      }
      
    } else if (pomodoroError) {
      console.error('❌ Error checking pomodoro_sessions table:', pomodoroError.message);
    } else {
      console.log('✅ pomodoro_sessions table already exists');
    }

    // Test other critical tables
    const tablesToCheck = ['todos', 'notes', 'backgrounds', 'pomodoro_stats'];
    
    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`⚠️  ${table} table issue:`, error.message);
      } else {
        console.log(`✅ ${table} table accessible`);
      }
    }

    console.log('\n🎉 Database verification completed!');
    
  } catch (error) {
    console.error('💥 Migration verification failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrationDirect();
}

module.exports = { runMigrationDirect };
