-- Test script to verify profiles RLS is working
-- Run this while authenticated in Supabase SQL editor

-- 1. Check current user
SELECT 
    'Current User Info:' as info,
    auth.uid() as user_id,
    auth.role() as user_role;

-- 2. Test SELECT policy
SELECT 
    'Testing SELECT policy:' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid()) 
        THEN 'SUCCESS: Can read own profile'
        ELSE 'FAILED: Cannot read own profile'
    END as result;

-- 3. Test if we can see the profile data
SELECT 
    'Profile Data:' as info,
    id,
    first_name,
    last_name,
    email,
    created_at
FROM profiles 
WHERE id = auth.uid();

-- 4. Test UPDATE policy (this will show if we can update, but won't actually update)
SELECT 
    'Testing UPDATE policy:' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() FOR UPDATE) 
        THEN 'SUCCESS: Can update own profile'
        ELSE 'FAILED: Cannot update own profile'
    END as result;

-- 5. Check if there are any RLS policy violations in the logs
-- (This might not work depending on your Supabase plan)
SELECT 
    'RLS Policy Check:' as info,
    'Check Supabase logs for any RLS violations' as note;
