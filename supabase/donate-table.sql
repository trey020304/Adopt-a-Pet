create table public.donate (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  donor_full_name text,
  donor_phone text,
  donor_email text,
  preferred_contact_method text,
  item_type text,
  item_specific text,
  quantity integer,
  item_condition text,
  donation_method text,
  pickup_dropoff_address text,
  preferred_date_time timestamp with time zone,
  notes text,
  evidence_url text,
  created_at timestamp with time zone default now()
);