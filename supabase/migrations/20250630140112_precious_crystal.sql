/*
  # Add Storage Bucket for Brand Assets

  1. New Storage Bucket
    - Create a new storage bucket for brand assets
    - Set up public access for brand assets
    - Configure RLS policies for the bucket

  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to manage their own assets
*/

-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand_assets', 'Brand Assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for the bucket
CREATE POLICY "Users can manage their own brand assets"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'brand_assets' AND
  (auth.uid() = SPLIT_PART(name, '/', 1)::uuid)
)
WITH CHECK (
  bucket_id = 'brand_assets' AND
  (auth.uid() = SPLIT_PART(name, '/', 1)::uuid)
);