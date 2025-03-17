-- Step 1: Check if the notes table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'notes'
);

-- Step 2: Check if updated_at column already exists in notes
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'updated_at'
);

-- Step 3: If the notes table exists and updated_at doesn't, add it
-- Execute this statement separately
-- ALTER TABLE notes ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 4: Check if feedback table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'feedback'
);

-- Step 5: Create feedback table (run separately)
/*
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  response TEXT
);
*/

-- Step 6: Create indexes (run separately)
/*
CREATE INDEX feedback_email_idx ON feedback(email);
CREATE INDEX feedback_status_idx ON feedback(status);
*/ 