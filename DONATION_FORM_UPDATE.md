# Donation Form Update - Multiple Items Support

## Summary of Changes

The donation form has been updated to support **multiple items per submission** instead of a single item. The `item_condition` field has been removed as it's no longer part of the new form design.

### What Changed

| Aspect | Old Format | New Format |
|--------|-----------|-----------|
| Items per submission | 1 item only | Multiple items (checkboxes) |
| Item storage | `item_type`, `item_specific`, `quantity` | `items` (JSON array) |
| Item condition | `item_condition` field | Removed |
| Form UI | Dropdowns | Checkboxes with quantity inputs |

## Database Changes Required

### Step 1: Apply the Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Migration: Update donate table to support multiple items instead of single item

-- Rename old columns to archive them
ALTER TABLE donate RENAME COLUMN item_type TO item_type_old;
ALTER TABLE donate RENAME COLUMN item_specific TO item_specific_old;
ALTER TABLE donate RENAME COLUMN quantity TO quantity_old;

-- Drop the item_condition column as it's no longer used
ALTER TABLE donate DROP COLUMN IF EXISTS item_condition;

-- Add new column to store items as JSON array
ALTER TABLE donate ADD COLUMN items jsonb DEFAULT '[]';
```

### Data Structure

The new `items` column stores an array of objects. Example:

```json
[
  {
    "name": "Pet Food (Cat)",
    "quantity": 5
  },
  {
    "name": "Toys",
    "quantity": 2
  },
  {
    "name": "Other",
    "description": "Dog bed",
    "quantity": 1
  }
]
```

**Standard items** have:
- `name`: Display name of the item type
- `quantity`: Number of items

**"Other" items** additionally have:
- `description`: Custom description of the item

## Code Changes

### Updated Files

1. **`public/js/donate-form-logic.js`**
   - Collects all checked items with their quantities
   - Validates that at least one item is selected
   - Sends items as JSON array to Supabase
   - Updated console logging to show items

2. **`supabase/update-donate-table.sql`** (NEW)
   - Migration to update the donate table schema
   - Archives old columns for backward compatibility
   - Adds new `items` JSONB column

### Form Structure (No Changes Needed)

The HTML form in `donate.html` already has the correct structure with:
- Checkboxes for each item type
- Quantity inputs that enable/disable with checkboxes
- Special handling for "Other" items with description field

## How to Test

### 1. Apply the Database Migration

1. Go to: Supabase Dashboard → SQL Editor
2. Copy the SQL from `supabase/update-donate-table.sql`
3. Run the migration
4. Verify the `items` column was added to the `donate` table

### 2. Test the Form Submission

1. Go to the donation form
2. Select multiple items (e.g., Pet Food (Cat) qty 3, Toys qty 2)
3. Fill in donor information
4. Submit the form
5. Check browser console for: `"inserting donation row" { user_id: "...", items: [...], ... }`
6. Verify the submission succeeded

### 3. Verify in Supabase

In Supabase SQL Editor, run:

```sql
SELECT id, donor_full_name, items, created_at 
FROM donate 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see the `items` column contains the JSON array of selected items.

## Available Item Types

The form supports these predefined item types:

1. Pet Food (Cat)
2. Pet Food (Dog)
3. Bowls
4. Toys
5. Leashes
6. Collars
7. Litter
8. Blankets
9. Bedding
10. Medicine
11. Grooming supplies
12. Crates/Cages
13. Cleaning supplies
14. Other (custom text + quantity)

## Backward Compatibility

The old columns (`item_type_old`, `item_specific_old`, `quantity_old`) are preserved for reference but are no longer used by the form. New submissions will only use the `items` column.

If you need to migrate old donation data to the new format, you can write a SQL migration script to transform the old columns into the new `items` array structure.

## Admin Dashboard Considerations

If you have an admin dashboard that displays donations, you'll need to update it to read from the `items` JSON column instead of the old `item_type`, `item_specific`, and `quantity` columns.

### Example: Reading Items in Admin

```javascript
// Query donations with items
const { data, error } = await supabase.from('donate').select('*');

// Display items for a donation
data.forEach(donation => {
  console.log(donation.items); // Array of items with quantities
  // Example output: 
  // [
  //   { name: 'Pet Food (Cat)', quantity: 5 },
  //   { name: 'Toys', quantity: 2 }
  // ]
});
```

## Validation

The form validates:
- ✅ At least one item must be selected
- ✅ Quantity must be > 0 for each selected item
- ✅ If "Other" is selected, description and quantity are required
- ✅ Donor information is still required (name, phone, email, contact method)

## Troubleshooting

### Issue: "Please select at least one item to donate"

**Cause:** No checkboxes were selected
**Fix:** Make sure to check at least one item type and enter a quantity

### Issue: Submission fails with error

**Check:**
1. Is the `items` column present in the `donate` table? Run: `SELECT * FROM information_schema.columns WHERE table_name = 'donate';`
2. Does the RLS policy allow INSERT on the `donate` table?
3. Check browser console for detailed error messages

### Issue: Old donations have empty items

**Cause:** Old donations used the old column structure
**Fix:** This is expected. You can leave them as-is or write a migration to populate the `items` column from the old columns.

## Files Modified

- `public/js/donate-form-logic.js` - Updated to collect and submit multiple items
- `supabase/update-donate-table.sql` - NEW migration file for database schema update
- `donate.html` - No changes needed (form structure was already correct)
