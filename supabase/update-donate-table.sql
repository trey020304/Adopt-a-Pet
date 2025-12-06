-- Migration: Update donate table to support multiple items instead of single item
-- This change makes the form support multiple item types with quantities in a single submission

-- Rename old columns to archive them (in case we need to migrate data)
ALTER TABLE donate RENAME COLUMN item_type TO item_type_old;
ALTER TABLE donate RENAME COLUMN item_specific TO item_specific_old;
ALTER TABLE donate RENAME COLUMN quantity TO quantity_old;

-- Drop the item_condition column as it's no longer used
ALTER TABLE donate DROP COLUMN IF EXISTS item_condition;

-- Add new column to store items as JSON array
ALTER TABLE donate ADD COLUMN items jsonb DEFAULT '[]';

-- COMMENT: 
-- items column stores array of objects: [
--   { "name": "Pet Food (Cat)", "quantity": 5 },
--   { "name": "Toys", "quantity": 2 },
--   { "name": "Other", "description": "Dog bed", "quantity": 1 }
-- ]

-- The old item_type_old, item_specific_old, quantity_old columns are kept for reference
-- but new submissions will use the 'items' column instead
