-- Diagnostic script to check profiles table RLS policies and data
-- Run this in your Supabase SQL editor to diagnose the issue

-- 1. Check if profiles table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check current RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Check if RLS is enabled on profiles table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. Check current user and auth.uid() (run this while logged in)
SELECT 
    auth.uid() as current_auth_uid,
    auth.role() as current_auth_role;

-- 5. Check if there are any profiles records and their structure
-- (This might fail if RLS is blocking access)
SELECT 
    id,
    first_name,
    last_name,
    email,
    created_at
FROM profiles 
LIMIT 5;

-- 6. Check if the current user has a profile record
-- (This will help determine if the issue is with the policy or missing data)
SELECT 
    id,
    first_name,
    last_name,
    email
FROM profiles 
WHERE id = auth.uid();

-- 7. Test the RLS policy directly
-- This will show you exactly what the policy is evaluating
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM profiles WHERE id = auth.uid();
