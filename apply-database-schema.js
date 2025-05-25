#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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

async function applyDatabaseSchema() {
  console.log('🚀 Starting complete database setup...');
  console.log('📋 This will create all necessary tables, indexes, and policies for your application.');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'complete-database-setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 SQL file loaded successfully');
    console.log('📊 SQL file size:', (sqlContent.length / 1024).toFixed(2), 'KB');
    
    // Split SQL into individual statements (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== "SELECT 'Database setup completed successfully! All tables, indexes, RLS policies, and triggers have been created.' AS status");
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute statements one by one
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        // Skip empty statements and comments
        if (statement.trim() === ';' || statement.trim().startsWith('--')) {
          continue;
        }
        
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // For CREATE TABLE, DROP POLICY, CREATE POLICY, etc., we'll use direct SQL execution
        const { data, error } = await supabase.rpc('exec_sql', { sql_statement: statement });
        
        if (error) {
          // Many errors are expected (like "table already exists", "policy already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('duplicate key')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message.split('.')[0]} (expected)`);
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            errorCount++;
          }
        } else {
          successCount++;
          if (i % 10 === 0 || i === statements.length - 1) {
            console.log(`✅ Executed ${i + 1}/${statements.length} statements`);
          }
        }
        
        // Small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (err) {
        console.error(`💥 Unexpected error on statement ${i + 1}:`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Execution Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⚠️  Errors/Warnings: ${errorCount}`);
    
    // Test the setup by checking some tables
    console.log('\n🔍 Verifying database setup...');
    
    const tablesToCheck = [
      'users', 'events', 'notes', 'todos', 'subtasks', 
      'tracks', 'user_pomodoros', 'flashcards', 'challenges', 
      'progress', 'tutorial_state', 'feedback', 'pomodoro_sessions',
      'backgrounds', 'pomodoro_stats'
    ];
    
    const tableResults = {};
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          tableResults[table] = `❌ ${error.message}`;
        } else {
          tableResults[table] = '✅ Accessible';
        }
      } catch (err) {
        tableResults[table] = `💥 ${err.message}`;
      }
    }
    
    console.log('\n📋 Table Verification Results:');
    Object.entries(tableResults).forEach(([table, status]) => {
      console.log(`  ${table}: ${status}`);
    });
    
    const successfulTables = Object.values(tableResults).filter(status => status.includes('✅')).length;
    const totalTables = tablesToCheck.length;
    
    console.log(`\n🎯 Database Setup Summary: ${successfulTables}/${totalTables} tables accessible`);
    
    if (successfulTables >= totalTables * 0.8) {
      console.log('🎉 Database setup completed successfully!');
      console.log('🔗 Your application should now be ready to use.');
    } else {
      console.log('⚠️  Some tables may need manual creation via Supabase dashboard.');
      console.log('📝 Please copy the SQL from complete-database-setup.sql to your Supabase SQL editor.');
    }

  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    console.error('📝 Please try running the SQL manually in your Supabase dashboard.');
    process.exit(1);
  }
}

// Alternative: Create a function to run SQL
async function createSQLFunction() {
  console.log('🔧 Creating SQL execution function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_statement text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_statement;
      RETURN 'OK';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN SQLERRM;
    END;
    $$;
  `;
  
  try {
    // We can't create functions via the REST API, so we'll show instructions instead
    console.log('📋 Manual Setup Required:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to your project: ptwhylqiogzmpltbnifu');
    console.log('3. Go to SQL Editor');
    console.log('4. First, create the exec_sql function:');
    console.log('─'.repeat(50));
    console.log(createFunctionSQL);
    console.log('─'.repeat(50));
    console.log('5. Then run the complete-database-setup.sql file');
    console.log('\n🔗 Dashboard URL: https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu/sql');
    
  } catch (error) {
    console.error('❌ Failed to create function:', error.message);
  }
}

if (require.main === module) {
  createSQLFunction();
}

module.exports = { applyDatabaseSchema, createSQLFunction };
