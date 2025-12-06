-- Add available column to animals table to track if animal is available for adoption
ALTER TABLE animals ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;

-- Update adoption page to filter out unavailable animals
-- This will be handled in the adoption.html loadAnimalsFromSupabase() function
