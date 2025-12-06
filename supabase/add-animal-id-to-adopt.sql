-- Drop the existing foreign key if it exists (in case it was already added)
ALTER TABLE adopt DROP CONSTRAINT IF EXISTS adopt_animal_id_fkey;

-- Add animal_id column with ON DELETE CASCADE to allow animals to be deleted
ALTER TABLE adopt ADD COLUMN IF NOT EXISTS animal_id UUID;
ALTER TABLE adopt ADD CONSTRAINT adopt_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE;

-- Add accepted and accepted_at columns for tracking adoption approval
ALTER TABLE adopt ADD COLUMN IF NOT EXISTS accepted BOOLEAN DEFAULT false;
ALTER TABLE adopt ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;

-- Ensure animals table has DELETE policy for anon/authenticated users
DROP POLICY IF EXISTS "allow_delete_animals" ON animals;
CREATE POLICY "allow_delete_animals" ON animals
  FOR DELETE
  USING (true);

-- Add RLS policy to allow users to insert their own adoption applications
DROP POLICY IF EXISTS "allow_insert_own_adoption" ON adopt;
CREATE POLICY "allow_insert_own_adoption" ON adopt
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow select for authenticated users and admins
DROP POLICY IF EXISTS "allow_select_adoption" ON adopt;
CREATE POLICY "allow_select_adoption" ON adopt
  FOR SELECT
  USING (true);

-- Allow update of adoption applications (permissive for admin)
DROP POLICY IF EXISTS "allow_update_own_adoption" ON adopt;
CREATE POLICY "allow_update_own_adoption" ON adopt
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
