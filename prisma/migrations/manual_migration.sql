-- First, add a default value to the existing notes.updated_at column
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create the Feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Feedback" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "response" TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Feedback_email_idx" ON "Feedback"("email");
CREATE INDEX IF NOT EXISTS "Feedback_status_idx" ON "Feedback"("status"); 