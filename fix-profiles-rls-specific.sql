-- Fix RLS policies for profiles table with your specific schema
-- This script is tailored to your exact table structure

-- First, check current RLS status and policies
SELECT 
    'Current RLS Status:' as info,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check existing policies
SELECT 
    'Existing Policies:' as info,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for your schema
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can bypass RLS (for admin operations and API calls)
CREATE POLICY "Service role can do everything" ON profiles
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Test the policies
SELECT 'Testing RLS policies...' as status;

-- Test 1: Check if we can read our own profile
SELECT 
    'Test 1 - Read own profile:' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid()) 
        THEN 'SUCCESS: Can read own profile'
        ELSE 'FAILED: Cannot read own profile'
    END as result;

-- Test 2: Try to read the profile data
SELECT 
    'Test 2 - Profile data:' as test,
    id,
    first_name,
    last_name,
    role,
    brand_id,
    status
FROM profiles 
WHERE id = auth.uid();

-- Test 3: Check if we can update (this tests the policy without actually updating)
SELECT 
    'Test 3 - Update permission:' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() FOR UPDATE) 
        THEN 'SUCCESS: Can update own profile'
        ELSE 'FAILED: Cannot update own profile'
    END as result;

-- Show final policy status
SELECT 
    'Final Policy Status:' as info,
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
