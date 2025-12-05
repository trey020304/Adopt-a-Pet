-- Supabase Storage Bucket Setup
-- Run these commands in Supabase SQL Editor to create the storage buckets

-- Create 'donate' bucket for donation photos
INSERT INTO storage.buckets (id, name, public) VALUES ('donate', 'donate', true);

-- Create 'rescue' bucket for rescue evidence
INSERT INTO storage.buckets (id, name, public) VALUES ('rescue', 'rescue', true);

-- Create 'adoption' bucket for adoption application files
INSERT INTO storage.buckets (id, name, public) VALUES ('adoption', 'adoption', true);

-- Set bucket policies to allow authenticated users to upload
-- Policy for 'donate' bucket
CREATE POLICY "Allow authenticated users to upload to donate" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'donate');

CREATE POLICY "Allow public read from donate" ON storage.objects
FOR SELECT
USING (bucket_id = 'donate');

-- Policy for 'rescue' bucket
CREATE POLICY "Allow authenticated users to upload to rescue" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rescue');

CREATE POLICY "Allow public read from rescue" ON storage.objects
FOR SELECT
USING (bucket_id = 'rescue');

-- Policy for 'adoption' bucket
CREATE POLICY "Allow authenticated users to upload to adoption" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'adoption');

CREATE POLICY "Allow public read from adoption" ON storage.objects
FOR SELECT
USING (bucket_id = 'adoption');
