-- Add animal_name column to rescue table
ALTER TABLE rescue
ADD COLUMN animal_name TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN rescue.animal_name IS 'Name of the animal being rescued, entered by admin when processing the inquiry';
