-- Create the feedback table with all lowercase column names
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  response TEXT
);

-- Create indexes
CREATE INDEX feedback_email_idx ON feedback(email);
CREATE INDEX feedback_status_idx ON feedback(status); 