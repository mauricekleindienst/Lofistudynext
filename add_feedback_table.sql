-- First, add a default value to the existing notes.updated_at column
ALTER TABLE notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create the feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  response TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS feedback_email_idx ON feedback(email);
CREATE INDEX IF NOT EXISTS feedback_status_idx ON feedback(status); 