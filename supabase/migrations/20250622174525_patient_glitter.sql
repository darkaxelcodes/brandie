/*
  # Add Brand Guidelines Table

  1. New Tables
    - `brand_guidelines`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `content` (jsonb)
      - `version` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on brand_guidelines table
    - Add policies for authenticated users to manage their own guidelines
*/

-- Create brand_guidelines table
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE UNIQUE,
  content jsonb DEFAULT '{}',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own brand guidelines"
  ON brand_guidelines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_guidelines.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_guidelines.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_brand_guidelines_updated_at
  BEFORE UPDATE ON brand_guidelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();