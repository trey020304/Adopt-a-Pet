-- Add accepted and accepted_at columns to rescue table if they don't exist
ALTER TABLE rescue ADD COLUMN IF NOT EXISTS accepted BOOLEAN DEFAULT false;
ALTER TABLE rescue ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;

-- Add accepted and accepted_at columns to donate table if they don't exist
ALTER TABLE donate ADD COLUMN IF NOT EXISTS accepted BOOLEAN DEFAULT false;
ALTER TABLE donate ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;

-- Add UPDATE policy to rescue table to allow updates
DROP POLICY IF EXISTS "allow_update_rescue" ON rescue;
CREATE POLICY "allow_update_rescue" ON rescue
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add UPDATE policy to donate table to allow updates
DROP POLICY IF EXISTS "allow_update_donate" ON donate;
CREATE POLICY "allow_update_donate" ON donate
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
