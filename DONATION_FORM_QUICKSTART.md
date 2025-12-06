# Donation Form Update - Quick Start

## TL;DR - What to Do

### 1. Apply Database Migration (Required)

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Rename old columns to archive them
ALTER TABLE donate RENAME COLUMN item_type TO item_type_old;
ALTER TABLE donate RENAME COLUMN item_specific TO item_specific_old;
ALTER TABLE donate RENAME COLUMN quantity TO quantity_old;

-- Drop the item_condition column
ALTER TABLE donate DROP COLUMN IF EXISTS item_condition;

-- Add new items column
ALTER TABLE donate ADD COLUMN items jsonb DEFAULT '[]';
```

### 2. Code is Already Updated ✅

- `donate-form-logic.js` - Updated to collect multiple items
- Form HTML - Already correct, no changes needed

### 3. Test It

1. Go to donation form
2. Select multiple items with quantities
3. Submit the form
4. Check Supabase to verify `items` column contains the JSON array

## What Changed

| Old | New |
|-----|-----|
| Single item dropdown | Multiple items with checkboxes |
| `item_type`, `item_specific`, `quantity` | Single `items` JSON array |
| Had `item_condition` field | Removed `item_condition` |

## Data Format Example

**Old format (no longer used):**
```
item_type: "Pet Food"
item_specific: "Cat Food"
quantity: 5
item_condition: "New"
```

**New format:**
```json
items: [
  { "name": "Pet Food (Cat)", "quantity": 5 },
  { "name": "Toys", "quantity": 2 }
]
```

## Form Items

✓ Pet Food (Cat)
✓ Pet Food (Dog)
✓ Bowls
✓ Toys
✓ Leashes
✓ Collars
✓ Litter
✓ Blankets
✓ Bedding
✓ Medicine
✓ Grooming supplies
✓ Crates/Cages
✓ Cleaning supplies
✓ Other (custom)

## Verify in Admin

To see donations with the new items format:

```sql
SELECT id, donor_full_name, items, created_at 
FROM donate 
ORDER BY created_at DESC;
```

## Files Changed

1. `public/js/donate-form-logic.js` - Collects multiple items
2. `supabase/update-donate-table.sql` - Migration file (NEW)
3. `DONATION_FORM_UPDATE.md` - Full documentation (NEW)
