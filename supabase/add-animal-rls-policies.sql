-- Add RLS policies for animals table to enable SELECT, UPDATE, INSERT, and DELETE for public/admin use
-- This fixes the issue where the admin page cannot update the 'available' column on animals

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
