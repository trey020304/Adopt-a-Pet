# Fix for Animal Unavailability Issue

## Problem Summary
When an adoption inquiry is accepted on the admin page:
- The animal should be marked as `available = false` in the Supabase database
- The adoption page should automatically remove the animal from the gallery within 2-3 seconds
- **Currently**: The animal remains visible on the adoption page even after acceptance

## Root Cause
The `animals` table in Supabase is missing proper Row Level Security (RLS) UPDATE and SELECT policies. The migration file `supabase/add-animal-rls-policies.sql` exists but hasn't been applied to the database yet.

## ⚠️ IMPORTANT: Required Action

### You MUST run this SQL migration in your Supabase project:

1. **Go to**: [Supabase Dashboard](https://app.supabase.com) → Your Project → SQL Editor
2. **Create a new query** and paste this SQL:

```sql
-- Add RLS policies for animals table to enable SELECT, UPDATE, INSERT, and DELETE for public/admin use

-- Enable RLS on animals table if not already enabled
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for all users (public read access to all animals)
DROP POLICY IF EXISTS "allow_select_animals" ON animals;
CREATE POLICY "allow_select_animals" ON animals
  FOR SELECT
  USING (true);

-- Allow UPDATE for all users (admin needs to mark animals as unavailable)
DROP POLICY IF EXISTS "allow_update_animals" ON animals;
CREATE POLICY "allow_update_animals" ON animals
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow INSERT for all users (to add new animals from rescue form)
DROP POLICY IF EXISTS "allow_insert_animals" ON animals;
CREATE POLICY "allow_insert_animals" ON animals
  FOR INSERT
  WITH CHECK (true);

-- Allow DELETE for all users
DROP POLICY IF EXISTS "allow_delete_animals" ON animals;
CREATE POLICY "allow_delete_animals" ON animals
  FOR DELETE
  USING (true);
```

3. **Click Run** and wait for the migration to complete
4. **Verify** that no errors appear

## What This Fixes

After applying the SQL migration:
- ✅ Admin can update the `available` column on animals
- ✅ Adoption page can read the updated status
- ✅ Animals disappear from the adoption gallery within 2-3 seconds of acceptance

## Code Changes Made

### 1. Updated `public/admin.html` - Better error logging
The admin page now has improved logging when marking animals as unavailable:
- Verifies the animal exists before attempting update
- Reports success/failure of the update
- Verifies the update by re-reading the animal's status
- Removes `.select()` from the update call to avoid RLS conflicts

This allows you to see detailed information in the browser console (F12) when troubleshooting.

### 2. Created `supabase/add-animal-rls-policies.sql` - RLS policies
This migration file contains all necessary RLS policies for the animals table.

## Testing After Applying the Migration

1. **Go to the admin page** and find an adoption inquiry
2. **Click "Accept"** to approve the adoption
3. **Check the browser console** (F12 → Console tab) for these messages:
   - `"Marking animal as unavailable: [uuid]"` - Shows which animal ID is being updated
   - `"Animal found: [...]"` - Confirms the animal exists in the database
   - `"Animal marked as unavailable successfully"` - Confirms the update worked
   - `"Animal availability status after update: [...]"` - Shows `available: false`

4. **Go to the adoption page** and refresh
   - The animal should no longer appear in the gallery
   - It should disappear automatically within 2-3 seconds without needing to refresh

## How It Works

### Adoption Page Flow (every 2 seconds):
```javascript
1. Query: SELECT * FROM animals
2. Filter: .filter(r => r.available !== false)  // Hide unavailable animals
3. Render: Update the gallery display
```

### Admin Page Flow (when accepting):
```javascript
1. Update: SET available = false WHERE id = animal_id
2. Verify: SELECT id, available FROM animals WHERE id = animal_id
3. Confirm: Log the status to console
```

## Troubleshooting

### Issue: Animal still appears after migration
**Check:**
1. Is the RLS policy actually applied? Go to Supabase Dashboard → Auth → Policies
2. Look for policies on the `animals` table:
   - `allow_select_animals` ✓
   - `allow_update_animals` ✓
   - `allow_insert_animals` ✓
   - `allow_delete_animals` ✓

### Issue: See error messages in admin console
**Common error**: "Could not mark animal as unavailable: RLS policy..."
- This means the RLS migration didn't run or failed
- Re-run the SQL migration above

### Issue: Want to verify the database directly
Run this in Supabase SQL Editor:
```sql
SELECT id, name, available FROM animals WHERE available = false;
```
Should show adopted animals with `available = false`

## Files Modified/Created
- `public/admin.html` - Enhanced error handling and logging
- `supabase/add-animal-rls-policies.sql` - RLS policy migration
- `ANIMAL_UNAVAILABILITY_FIX.md` - This guide
