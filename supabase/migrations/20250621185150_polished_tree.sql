/*
  # Brand Strategy Database Schema

  1. New Tables
    - `brands`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `strategy_sections`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `section_type` (text: purpose, values, audience, competitive, archetype)
      - `content` (jsonb)
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create strategy_sections table
CREATE TABLE IF NOT EXISTS strategy_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('purpose', 'values', 'audience', 'competitive', 'archetype')),
  content jsonb DEFAULT '{}',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_sections ENABLE ROW LEVEL SECURITY;

-- Brands policies
CREATE POLICY "Users can read own brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Strategy sections policies
CREATE POLICY "Users can read own strategy sections"
  ON strategy_sections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = strategy_sections.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own strategy sections"
  ON strategy_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = strategy_sections.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own strategy sections"
  ON strategy_sections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = strategy_sections.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own strategy sections"
  ON strategy_sections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = strategy_sections.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategy_sections_updated_at
  BEFORE UPDATE ON strategy_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();