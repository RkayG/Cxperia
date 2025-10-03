-- Platform Feedback Table Schema
-- This table stores feedback from platform users (bug reports, feature requests, etc.)

CREATE TABLE IF NOT EXISTS platform_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug_report', 'feature_request', 'general_feedback', 'support')),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_platform_feedback_user_id ON platform_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_brand_id ON platform_feedback(brand_id);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_type ON platform_feedback(type);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_status ON platform_feedback(status);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_priority ON platform_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_created_at ON platform_feedback(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_platform_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_platform_feedback_updated_at
  BEFORE UPDATE ON platform_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_feedback_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE platform_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON platform_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON platform_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own feedback (only if status is 'open')
CREATE POLICY "Users can update own open feedback" ON platform_feedback
  FOR UPDATE USING (auth.uid() = user_id AND status = 'open');

-- Policy: Admins can view all feedback (you may need to adjust this based on your admin logic)
CREATE POLICY "Admins can view all feedback" ON platform_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@cxperia.com' OR auth.users.email LIKE '%admin%')
    )
  );

-- Policy: Admins can update all feedback
CREATE POLICY "Admins can update all feedback" ON platform_feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@cxperia.com' OR auth.users.email LIKE '%admin%')
    )
  );

-- Add some sample data (optional)
INSERT INTO platform_feedback (user_id, brand_id, type, subject, message, priority, user_email, user_name) VALUES
  (NULL, NULL, 'feature_request', 'Dark mode support', 'It would be great to have a dark mode option for the dashboard.', 'medium', 'user@example.com', 'John Doe'),
  (NULL, NULL, 'bug_report', 'Login issue on mobile', 'Users are experiencing login problems on mobile devices.', 'high', 'support@example.com', 'Support Team'),
  (NULL, NULL, 'general_feedback', 'Great platform!', 'Love the new features and the overall experience.', 'low', 'feedback@example.com', 'Happy User')
ON CONFLICT DO NOTHING;
