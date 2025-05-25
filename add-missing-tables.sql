-- Add missing tables only if they don't exist
-- This script adds tables that might be missing from the existing database

-- Create pomodoro_sessions table (if it doesn't exist)
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

-- Enable RLS on pomodoro_sessions if table was created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pomodoro_sessions') THEN
        ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies for pomodoro_sessions
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pomodoro_sessions') THEN
        -- Users can only see their own pomodoro sessions
        CREATE POLICY IF NOT EXISTS "Users can view own pomodoro sessions" ON pomodoro_sessions
            FOR SELECT USING (auth.uid() = user_id);

        -- Users can insert their own pomodoro sessions
        CREATE POLICY IF NOT EXISTS "Users can insert own pomodoro sessions" ON pomodoro_sessions
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Users can update their own pomodoro sessions
        CREATE POLICY IF NOT EXISTS "Users can update own pomodoro sessions" ON pomodoro_sessions
            FOR UPDATE USING (auth.uid() = user_id);

        -- Users can delete their own pomodoro sessions
        CREATE POLICY IF NOT EXISTS "Users can delete own pomodoro sessions" ON pomodoro_sessions
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add any other missing tables here as needed

-- Update the updated_at trigger for pomodoro_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for pomodoro_sessions updated_at
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pomodoro_sessions') THEN
        DROP TRIGGER IF EXISTS update_pomodoro_sessions_updated_at ON pomodoro_sessions;
        CREATE TRIGGER update_pomodoro_sessions_updated_at 
            BEFORE UPDATE ON pomodoro_sessions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
