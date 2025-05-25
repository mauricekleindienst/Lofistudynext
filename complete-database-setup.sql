-- Supabase Database Complete Setup
-- Run this SQL in your Supabase SQL editor to set up all tables
-- This script is safe to run multiple times (uses IF NOT EXISTS where possible)

-- First, let's create a users table to complement auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    premium BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create backgrounds table (seems to be missing from schema)
CREATE TABLE IF NOT EXISTS public.backgrounds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT,
    category VARCHAR(100),
    premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pomodoro_stats table (referenced in API but not in schema)
CREATE TABLE IF NOT EXISTS public.pomodoro_stats (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    sessions_completed INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, category)
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER,
    color VARCHAR(7) DEFAULT '#ff7b00',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create user_pomodoros table
CREATE TABLE IF NOT EXISTS public.user_pomodoros (
    email VARCHAR(255) PRIMARY KEY,
    pomodoro_count INTEGER DEFAULT 0,
    firstname VARCHAR(255),
    studying INTEGER DEFAULT 0,
    coding INTEGER DEFAULT 0,
    writing INTEGER DEFAULT 0,
    working INTEGER DEFAULT 0,
    other INTEGER DEFAULT 0,
    daily_counts JSONB DEFAULT '{}',
    pomodoro_count_weekly INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS public.flashcards (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    color VARCHAR(7) DEFAULT '#ff7b00',
    image_url TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    last_reviewed TIMESTAMPTZ,
    next_review TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward TEXT NOT NULL,
    total INTEGER NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    tracking_type TEXT NOT NULL,
    time_requirement JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tutorial_state table
CREATE TABLE IF NOT EXISTS public.tutorial_state (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    tutorial TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    response TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create pomodoro_sessions table (improved version)
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email VARCHAR(255) NOT NULL,
    duration INTEGER DEFAULT 1500, -- 25 minutes in seconds
    type TEXT DEFAULT 'work' CHECK (type IN ('work', 'short_break', 'long_break')),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    task_name TEXT,
    notes TEXT,
    category VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_email ON public.notes(email);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_email ON public.todos(email);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON public.todos(completed);

CREATE INDEX IF NOT EXISTS idx_subtasks_todo_id ON public.subtasks(todo_id);

CREATE INDEX IF NOT EXISTS idx_tracks_user_id ON public.tracks(user_id);

CREATE INDEX IF NOT EXISTS idx_user_pomodoros_user_id ON public.user_pomodoros(user_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_email ON public.flashcards(email);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON public.flashcards(next_review);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_challenge_id ON public.progress(challenge_id);

CREATE INDEX IF NOT EXISTS idx_tutorial_state_user_id ON public.tutorial_state(user_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_state_email_tutorial ON public.tutorial_state(email, tutorial);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON public.feedback(email);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);

CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON public.pomodoro_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_type ON public.pomodoro_sessions(type);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed ON public.pomodoro_sessions(completed);

CREATE INDEX IF NOT EXISTS idx_pomodoro_stats_user_id ON public.pomodoro_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_stats_date ON public.pomodoro_stats(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pomodoros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Backgrounds policies (public read access)
DROP POLICY IF EXISTS "Anyone can view backgrounds" ON public.backgrounds;
CREATE POLICY "Anyone can view backgrounds" ON public.backgrounds
    FOR SELECT USING (true);

-- Pomodoro stats policies
DROP POLICY IF EXISTS "Users can view their own pomodoro stats" ON public.pomodoro_stats;
CREATE POLICY "Users can view their own pomodoro stats" ON public.pomodoro_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own pomodoro stats" ON public.pomodoro_stats;
CREATE POLICY "Users can insert their own pomodoro stats" ON public.pomodoro_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pomodoro stats" ON public.pomodoro_stats;
CREATE POLICY "Users can update their own pomodoro stats" ON public.pomodoro_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Events policies
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;
CREATE POLICY "Users can view their own events" ON public.events
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
CREATE POLICY "Users can insert their own events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events" ON public.events
    FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
CREATE POLICY "Users can insert their own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- Todos policies
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
CREATE POLICY "Users can view their own todos" ON public.todos
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own todos" ON public.todos;
CREATE POLICY "Users can insert their own todos" ON public.todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
CREATE POLICY "Users can update their own todos" ON public.todos
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;
CREATE POLICY "Users can delete their own todos" ON public.todos
    FOR DELETE USING (auth.uid() = user_id);

-- Subtasks policies
DROP POLICY IF EXISTS "Users can view subtasks of their todos" ON public.subtasks;
CREATE POLICY "Users can view subtasks of their todos" ON public.subtasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM todos 
            WHERE todos.id = subtasks.todo_id 
            AND todos.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert subtasks for their todos" ON public.subtasks;
CREATE POLICY "Users can insert subtasks for their todos" ON public.subtasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM todos 
            WHERE todos.id = subtasks.todo_id 
            AND todos.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update subtasks of their todos" ON public.subtasks;
CREATE POLICY "Users can update subtasks of their todos" ON public.subtasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM todos 
            WHERE todos.id = subtasks.todo_id 
            AND todos.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete subtasks of their todos" ON public.subtasks;
CREATE POLICY "Users can delete subtasks of their todos" ON public.subtasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM todos 
            WHERE todos.id = subtasks.todo_id 
            AND todos.user_id = auth.uid()
        )
    );

-- Tracks policies
DROP POLICY IF EXISTS "Users can view their own tracks" ON public.tracks;
CREATE POLICY "Users can view their own tracks" ON public.tracks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tracks" ON public.tracks;
CREATE POLICY "Users can insert their own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracks" ON public.tracks;
CREATE POLICY "Users can update their own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tracks" ON public.tracks;
CREATE POLICY "Users can delete their own tracks" ON public.tracks
    FOR DELETE USING (auth.uid() = user_id);

-- User pomodoros policies
DROP POLICY IF EXISTS "Users can view their own user pomodoros" ON public.user_pomodoros;
CREATE POLICY "Users can view their own user pomodoros" ON public.user_pomodoros
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user pomodoros" ON public.user_pomodoros;
CREATE POLICY "Users can insert their own user pomodoros" ON public.user_pomodoros
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user pomodoros" ON public.user_pomodoros;
CREATE POLICY "Users can update their own user pomodoros" ON public.user_pomodoros
    FOR UPDATE USING (auth.uid() = user_id);

-- Flashcards policies
DROP POLICY IF EXISTS "Users can view their own flashcards" ON public.flashcards;
CREATE POLICY "Users can view their own flashcards" ON public.flashcards
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own flashcards" ON public.flashcards;
CREATE POLICY "Users can insert their own flashcards" ON public.flashcards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own flashcards" ON public.flashcards;
CREATE POLICY "Users can update their own flashcards" ON public.flashcards
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own flashcards" ON public.flashcards;
CREATE POLICY "Users can delete their own flashcards" ON public.flashcards
    FOR DELETE USING (auth.uid() = user_id);

-- Challenges policies (public read access)
DROP POLICY IF EXISTS "Anyone can view challenges" ON public.challenges;
CREATE POLICY "Anyone can view challenges" ON public.challenges
    FOR SELECT USING (true);

-- Progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.progress;
CREATE POLICY "Users can view their own progress" ON public.progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.progress;
CREATE POLICY "Users can insert their own progress" ON public.progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.progress;
CREATE POLICY "Users can update their own progress" ON public.progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Tutorial state policies
DROP POLICY IF EXISTS "Users can view their own tutorial state" ON public.tutorial_state;
CREATE POLICY "Users can view their own tutorial state" ON public.tutorial_state
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tutorial state" ON public.tutorial_state;
CREATE POLICY "Users can insert their own tutorial state" ON public.tutorial_state
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tutorial state" ON public.tutorial_state;
CREATE POLICY "Users can update their own tutorial state" ON public.tutorial_state
    FOR UPDATE USING (auth.uid() = user_id);

-- Feedback policies
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;
CREATE POLICY "Users can view their own feedback" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.feedback;
CREATE POLICY "Users can insert their own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pomodoro sessions policies
DROP POLICY IF EXISTS "Users can view their own pomodoro sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can view their own pomodoro sessions" ON public.pomodoro_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own pomodoro sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can insert their own pomodoro sessions" ON public.pomodoro_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pomodoro sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can update their own pomodoro sessions" ON public.pomodoro_sessions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own pomodoro sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can delete their own pomodoro sessions" ON public.pomodoro_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_updated_at ON public.progress;
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tutorial_state_updated_at ON public.tutorial_state;
CREATE TRIGGER update_tutorial_state_updated_at BEFORE UPDATE ON public.tutorial_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pomodoro_stats_updated_at ON public.pomodoro_stats;
CREATE TRIGGER update_pomodoro_stats_updated_at BEFORE UPDATE ON public.pomodoro_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;

-- Insert some default backgrounds
INSERT INTO public.backgrounds (name, url, thumbnail, category, premium) VALUES
('Forest Study', 'https://example.com/forest.mp4', 'https://example.com/forest-thumb.jpg', 'nature', false),
('Rain Ambience', 'https://example.com/rain.mp4', 'https://example.com/rain-thumb.jpg', 'weather', false),
('Coffee Shop', 'https://example.com/coffee.mp4', 'https://example.com/coffee-thumb.jpg', 'indoor', false),
('Ocean Waves', 'https://example.com/ocean.mp4', 'https://example.com/ocean-thumb.jpg', 'nature', false),
('Library Silence', 'https://example.com/library.mp4', 'https://example.com/library-thumb.jpg', 'indoor', false)
ON CONFLICT DO NOTHING;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Initialize user pomodoro stats
  INSERT INTO public.user_pomodoros (email, user_id)
  VALUES (NEW.email, NEW.id)
  ON CONFLICT (email) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'Database setup completed successfully! All tables, indexes, RLS policies, and triggers have been created.' AS status;
