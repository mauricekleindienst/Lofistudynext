const { createClient } = require('@supabase/supabase-js')

async function setupNotesTable() {
  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log('🔗 Connected to Supabase database')

  try {
    // Check if notes table exists
    console.log('📋 Checking notes table...')
    
    // Create notes table if it doesn't exist
    const createNotesTableSQL = `
      CREATE TABLE IF NOT EXISTS public.notes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
      );
    `
    
    console.log('📝 Creating/verifying notes table...')
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createNotesTableSQL 
    })
    
    if (createError) {
      console.error('❌ Error creating notes table:', createError)
      return
    }
    
    console.log('✅ Notes table created/verified successfully')

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...')
    const enableRLSSQL = 'ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;'
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: enableRLSSQL 
    })
    
    if (rlsError) {
      console.log('⚠️ RLS may already be enabled:', rlsError.message)
    } else {
      console.log('🔒 RLS enabled for notes table')
    }

    // Drop existing policies (if any) and create new ones
    console.log('📋 Setting up RLS policies...')
    
    const setupPoliciesSQL = `
      -- Drop existing policies
      DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
      DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
      DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
      DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
      
      -- Create new policies
      CREATE POLICY "Users can view their own notes" ON public.notes
        FOR SELECT USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can insert their own notes" ON public.notes
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        
      CREATE POLICY "Users can update their own notes" ON public.notes
        FOR UPDATE USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can delete their own notes" ON public.notes
        FOR DELETE USING (auth.uid() = user_id);
        
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
      CREATE INDEX IF NOT EXISTS idx_notes_email ON public.notes(email);
      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at);
    `
    
    const { error: policyError } = await supabase.rpc('exec_sql', { 
      sql: setupPoliciesSQL 
    })
    
    if (policyError) {
      console.error('❌ Error setting up policies:', policyError)
      return
    }
    
    console.log('✅ RLS policies created successfully')

    // Test database access
    console.log('🧪 Testing database access...')
    
    // Try to get count using service role (should bypass RLS)
    const { count, error: countError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error accessing notes table:', countError)
    } else {
      console.log(`✅ Notes table accessible, found ${count} records`)
    }

    console.log('🎉 Notes table setup completed successfully!')
    
    console.log(`
📝 Notes table is now ready with:
  - Row Level Security enabled
  - Policies for SELECT, INSERT, UPDATE, DELETE
  - Proper indexes for performance
  
🔑 Users can now:
  - Create their own notes
  - View only their own notes  
  - Update only their own notes
  - Delete only their own notes
`)

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Load environment variables from EVV file
require('dotenv').config({ path: './EVV' })

// Run the setup
setupNotesTable()
