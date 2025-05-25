# Supabase Database Setup Instructions

## 🎯 Objective
Fix your Supabase database schema by creating all necessary tables, indexes, and policies for your LoFi Study app.

## 📋 Current Status
- ❌ Database is missing essential tables (`users`, `pomodoro_sessions`, etc.)
- ❌ API endpoints are failing with "relation does not exist" errors
- ✅ Environment variables are properly configured
- ✅ Authentication system is set up

## 🚀 Quick Setup Steps

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu/sql
2. You should already be logged in (browser opened automatically)

### Step 2: Run the Complete Database Setup
1. Copy the entire contents of `complete-database-setup.sql` 
2. Paste it into the SQL editor
3. Click "Run" button
4. Wait for all statements to execute

### Step 3: Verify Setup
After running the SQL, you should see these tables created:
- ✅ `users` - User profiles and settings
- ✅ `events` - Calendar events
- ✅ `notes` - User notes
- ✅ `todos` - Task management
- ✅ `subtasks` - Sub-tasks for todos
- ✅ `tracks` - Music/video tracks
- ✅ `user_pomodoros` - Pomodoro statistics
- ✅ `flashcards` - Study flashcards
- ✅ `challenges` - User challenges
- ✅ `progress` - Challenge progress
- ✅ `tutorial_state` - Tutorial completion status
- ✅ `feedback` - User feedback
- ✅ `pomodoro_sessions` - Individual pomodoro sessions
- ✅ `backgrounds` - Available backgrounds
- ✅ `pomodoro_stats` - Detailed statistics

## 🔧 What the Setup Includes

### Tables & Schema
- All necessary tables with proper foreign keys
- UUID primary keys for security
- Proper data types and constraints
- Default values and check constraints

### Security (RLS)
- Row Level Security enabled on all tables
- Users can only access their own data
- Public read access for backgrounds and challenges
- Secure policies for all CRUD operations

### Performance
- Comprehensive indexes for fast queries
- User ID indexes for auth-based queries
- Date indexes for time-based queries
- Email indexes for legacy compatibility

### Automation
- Triggers for automatic timestamp updates
- Function to handle new user registration
- Auto-creation of user profiles on signup

## 🔍 After Setup - Test Your Database

Run this command to verify everything works:
```bash
node database-migration.js
```

This will test connections to all tables and show you the status.

## 🎉 Expected Results

After successful setup:
1. ✅ All API endpoints should work without "relation does not exist" errors
2. ✅ User registration should automatically create user profiles
3. ✅ Authentication should work seamlessly
4. ✅ All app features (todos, notes, pomodoro, etc.) should function
5. ✅ Data will be properly secured with RLS policies

## 🚨 Troubleshooting

If you encounter issues:

### Problem: "permission denied for schema public"
**Solution**: Make sure you're using the service role key in your environment variables.

### Problem: "relation already exists"
**Solution**: This is normal - the script uses `IF NOT EXISTS` for safety.

### Problem: Some tables missing
**Solution**: Run the SQL again - it's safe to execute multiple times.

### Problem: Authentication errors
**Solution**: Check that your `.env.local` has the correct Supabase keys.

## 📁 Files Created

1. `complete-database-setup.sql` - Complete database schema
2. `apply-database-schema.js` - Automated setup script
3. `database-migration.js` - Verification script
4. This instruction file

## 🔗 Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu)
- [SQL Editor](https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu/sql)
- [Table Editor](https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu/editor)
- [Authentication](https://supabase.com/dashboard/project/ptwhylqiogzmpltbnifu/auth/users)

---

**Next Steps**: After running the SQL setup, test your application by registering a new user and using the app features. All API endpoints should now work correctly!
