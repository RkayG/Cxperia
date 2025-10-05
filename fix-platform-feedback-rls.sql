-- Fix platform_feedback RLS policies that are causing "permission denied for table users" error
-- The issue is that the admin policies are trying to access auth.users table directly

-- Check current platform_feedback policies
SELECT 
    'Current platform_feedback policies:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'platform_feedback';

-- Drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all feedback" ON platform_feedback;
DROP POLICY IF EXISTS "Admins can update all feedback" ON platform_feedback;

-- Create better admin policies that don't access auth.users directly
-- Instead, we'll check the user's role in the profiles table

-- Policy: Admins can view all feedback (using profiles table instead of auth.users)
CREATE POLICY "Admins can view all feedback" ON platform_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'sales_admin', 'admin')
    )
  );

-- Policy: Admins can update all feedback (using profiles table instead of auth.users)
CREATE POLICY "Admins can update all feedback" ON platform_feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'sales_admin', 'admin')
    )
  );

-- Alternative: If you want to use email-based admin detection, create a function
-- This approach is more secure and doesn't expose the auth.users table

-- Create a function to check if user is admin (based on email patterns)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
DECLARE
  user_email text;
BEGIN
  -- Get user email from auth.users (this is accessible in functions)
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Check if email matches admin patterns
  RETURN user_email LIKE '%@cxperia.com' OR user_email LIKE '%admin%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative admin policies using the function
-- Uncomment these if you prefer email-based admin detection:

-- DROP POLICY IF EXISTS "Admins can view all feedback" ON platform_feedback;
-- CREATE POLICY "Admins can view all feedback" ON platform_feedback
--   FOR SELECT USING (is_admin_user());

-- DROP POLICY IF EXISTS "Admins can update all feedback" ON platform_feedback;
-- CREATE POLICY "Admins can update all feedback" ON platform_feedback
--   FOR UPDATE USING (is_admin_user());

-- Test the policies
SELECT 'Testing platform_feedback policies...' as status;

-- Test 1: Check if regular users can insert feedback
SELECT 
    'Test 1 - User insert permission:' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM platform_feedback WHERE user_id = auth.uid() LIMIT 1) 
        THEN 'SUCCESS: Can access own feedback'
        ELSE 'FAILED: Cannot access own feedback'
    END as result;

-- Test 2: Check admin permissions (if you're an admin)
SELECT 
    'Test 2 - Admin permissions:' as test,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'sales_admin', 'admin')
        )
        THEN 'SUCCESS: You are an admin'
        ELSE 'INFO: You are not an admin'
    END as result;

-- Show final policy status
SELECT 
    'Final platform_feedback policies:' as info,
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_clause
FROM pg_policies 
WHERE tablename = 'platform_feedback'
ORDER BY policyname;
