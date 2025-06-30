/*
  # Fix RLS Policies for Brand Creation

  1. Security Updates
    - Fix RLS policies to use proper auth.uid() function
    - Ensure brand creation works for authenticated users
    - Add proper foreign key constraints

  2. Policy Updates
    - Update all brand-related policies
    - Fix strategy sections policies
    - Fix visual assets and brand voice policies
*/

-- Drop and recreate brands policies with correct syntax
DROP POLICY IF EXISTS "Users can create own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete own brands" ON brands;
DROP POLICY IF EXISTS "Users can read own brands" ON brands;
DROP POLICY IF EXISTS "Users can update own brands" ON brands;

-- Create corrected policies for brands table
CREATE POLICY "Users can create own brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix strategy sections policies
DROP POLICY IF EXISTS "Users can create own strategy sections" ON strategy_sections;
DROP POLICY IF EXISTS "Users can delete own strategy sections" ON strategy_sections;
DROP POLICY IF EXISTS "Users can read own strategy sections" ON strategy_sections;
DROP POLICY IF EXISTS "Users can update own strategy sections" ON strategy_sections;

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

-- Fix visual assets policies
DROP POLICY IF EXISTS "Users can manage own visual assets" ON visual_assets;

CREATE POLICY "Users can manage own visual assets"
  ON visual_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = visual_assets.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = visual_assets.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Fix brand voice policies
DROP POLICY IF EXISTS "Users can manage own brand voice" ON brand_voice;

CREATE POLICY "Users can manage own brand voice"
  ON brand_voice
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_voice.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_voice.brand_id 
      AND brands.user_id = auth.uid()
    )
  );