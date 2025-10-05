-- Diagnostic script to check experience status
-- Run this in your Supabase SQL editor to diagnose the issue

-- 1. Check if the experience exists at all
SELECT 
    'Experience Exists Check:' as info,
    id,
    public_slug,
    name,
    is_published,
    created_at,
    updated_at
FROM experiences 
WHERE public_slug = 'gKokCQLm';

-- 2. Check all experiences with similar slugs
SELECT 
    'Similar Slugs:' as info,
    id,
    public_slug,
    name,
    is_published,
    created_at
FROM experiences 
WHERE public_slug LIKE '%gKokCQLm%' 
   OR public_slug LIKE '%gKok%'
ORDER BY created_at DESC;

-- 3. Check recent experiences to see the pattern
SELECT 
    'Recent Experiences:' as info,
    id,
    public_slug,
    name,
    is_published,
    created_at
FROM experiences 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check if there are any experiences that are not published
SELECT 
    'Unpublished Experiences:' as info,
    COUNT(*) as count,
    COUNT(CASE WHEN is_published = false THEN 1 END) as unpublished_count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM experiences;

-- 5. Check the specific experience with more details
SELECT 
    'Detailed Experience Info:' as info,
    e.id,
    e.public_slug,
    e.name,
    e.is_published,
    e.scan_count,
    e.total_scan_count,
    e.unique_scan_count,
    e.created_at,
    e.updated_at,
    p.name as product_name,
    b.name as brand_name
FROM experiences e
LEFT JOIN products p ON e.product_id = p.id
LEFT JOIN brands b ON e.brand_id = b.id
WHERE e.public_slug = 'gKokCQLm';
