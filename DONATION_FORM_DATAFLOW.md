# Donation Form Data Flow

## Before (Old Format)

```
┌─────────────────────────────────────┐
│   Donation Form (Single Item)       │
├─────────────────────────────────────┤
│ • Select Item Type (dropdown)       │
│ • Enter Item Specific (text)        │
│ • Enter Quantity (number)           │
│ • Select Item Condition (dropdown)  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│   Data Submitted                    │
├─────────────────────────────────────┤
│ {                                   │
│   item_type: "Pet Supplies",        │
│   item_specific: "Dog Food",        │
│   quantity: 5,                      │
│   item_condition: "New",            │
│   ...                               │
│ }                                   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│   Supabase (Old Schema)             │
├─────────────────────────────────────┤
│ donate table:                       │
│ • item_type (text)                  │
│ • item_specific (text)              │
│ • quantity (integer)                │
│ • item_condition (text)             │
│ • ...                               │
└─────────────────────────────────────┘
```

## After (New Format)

```
┌────────────────────────────────────────────┐
│   Donation Form (Multiple Items)           │
├────────────────────────────────────────────┤
│ ☑ Pet Food (Cat)        Qty: [5]           │
│ ☐ Pet Food (Dog)        Qty: [ ]           │
│ ☑ Toys                  Qty: [2]           │
│ ☐ Bowls                 Qty: [ ]           │
│ ☑ Other: [Dog bed  ] Qty: [1]              │
│ ... (more items)                           │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│   Data Submitted                           │
├────────────────────────────────────────────┤
│ {                                          │
│   items: [                                 │
│     {                                      │
│       "name": "Pet Food (Cat)",            │
│       "quantity": 5                        │
│     },                                     │
│     {                                      │
│       "name": "Toys",                      │
│       "quantity": 2                        │
│     },                                     │
│     {                                      │
│       "name": "Other",                     │
│       "description": "Dog bed",            │
│       "quantity": 1                        │
│     }                                      │
│   ],                                       │
│   ...                                      │
│ }                                          │
└────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│   Supabase (New Schema)                    │
├────────────────────────────────────────────┤
│ donate table:                              │
│ • items (jsonb) ← NEW!                     │
│ • item_type_old (text) [archived]          │
│ • item_specific_old (text) [archived]      │
│ • quantity_old (integer) [archived]        │
│ • [item_condition removed]                 │
│ • ...                                      │
└────────────────────────────────────────────┘
```

## JavaScript Logic Flow

```
Form Submission
    ↓
Validate required fields
    ↓
Upload photos (optional)
    ↓
Collect all checked items
    ├─ Iterate through predefined items
    ├─ Check if checkbox is checked
    ├─ Get quantity value
    └─ Add to items array
    ↓
Check for "Other" item
    ├─ If checked, get description
    ├─ Get quantity value
    └─ Add to items array
    ↓
Validate items array
    ├─ Must have at least 1 item
    └─ Show error if empty
    ↓
Build data object
    ├─ All donor info
    ├─ items array (NEW)
    └─ Metadata (created_at, etc.)
    ↓
Insert into Supabase
    ├─ Send POST request
    ├─ Handle errors
    └─ Show success message
    ↓
Redirect to donation form
```

## Item Names Mapping

The form uses this mapping to convert field names to display names:

```javascript
{
  'item_pet_food_cat': 'Pet Food (Cat)',
  'item_pet_food_dog': 'Pet Food (Dog)',
  'item_bowls': 'Bowls',
  'item_toys': 'Toys',
  'item_leashes': 'Leashes',
  'item_collars': 'Collars',
  'item_litter': 'Litter',
  'item_blankets': 'Blankets',
  'item_bedding': 'Bedding',
  'item_medicine': 'Medicine',
  'item_grooming': 'Grooming supplies',
  'item_crates': 'Crates/Cages',
  'item_cleaning': 'Cleaning supplies'
}
```

## Database Schema Evolution

### Old Schema

```sql
CREATE TABLE donate (
  id uuid PRIMARY KEY,
  user_id uuid,
  donor_full_name text,
  donor_phone text,
  donor_email text,
  preferred_contact_method text,
  item_type text,              ← Single item
  item_specific text,          ← Single item
  quantity integer,            ← Single item
  item_condition text,         ← Removed
  donation_method text,
  pickup_dropoff_address text,
  preferred_date_time timestamp,
  notes text,
  evidence_url text,
  created_at timestamp
);
```

### New Schema

```sql
CREATE TABLE donate (
  id uuid PRIMARY KEY,
  user_id uuid,
  donor_full_name text,
  donor_phone text,
  donor_email text,
  preferred_contact_method text,
  items jsonb,                 ← NEW: Multiple items
  item_type_old text,          ← Archived (old data)
  item_specific_old text,      ← Archived (old data)
  quantity_old integer,        ← Archived (old data)
  -- item_condition text,      ← REMOVED
  donation_method text,
  pickup_dropoff_address text,
  preferred_date_time timestamp,
  notes text,
  evidence_url text,
  created_at timestamp
);
```

## Querying the New Format

### Get all donations with items

```sql
SELECT id, donor_full_name, items, created_at 
FROM donate 
ORDER BY created_at DESC;
```

### Get specific item counts

```sql
SELECT 
  id,
  donor_full_name,
  items->0->>'name' as first_item,
  items->0->>'quantity' as quantity
FROM donate
WHERE items IS NOT NULL
LIMIT 10;
```

### Count donations with specific items

```sql
SELECT COUNT(*)
FROM donate,
jsonb_array_elements(items) as item
WHERE item->>'name' = 'Pet Food (Cat)';
```

## Migration Path for Old Data

If you need to migrate old donations to use the new `items` format:

```sql
-- Populate items column from old columns for existing donations
UPDATE donate 
SET items = jsonb_build_array(
  jsonb_build_object(
    'name', COALESCE(item_specific_old, item_type_old, 'Unknown'),
    'quantity', COALESCE(quantity_old, 1)
  )
)
WHERE items = '[]'::jsonb
  AND (item_type_old IS NOT NULL OR item_specific_old IS NOT NULL);
```

This creates entries like:
```json
[
  {
    "name": "Dog Food",
    "quantity": 5
  }
]
```
