/*
  # Add Visual Identity and Brand Voice Tables

  1. New Tables
    - `visual_assets`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `asset_type` (text, enum: logo, color_palette, typography)
      - `asset_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `brand_voice`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `tone_scales` (jsonb)
      - `messaging` (jsonb)
      - `guidelines` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own brand assets
*/

-- Visual Assets Table
CREATE TABLE IF NOT EXISTS visual_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('logo', 'color_palette', 'typography')),
  asset_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visual_assets ENABLE ROW LEVEL SECURITY;

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

-- Brand Voice Table
CREATE TABLE IF NOT EXISTS brand_voice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE UNIQUE,
  tone_scales jsonb DEFAULT '{}',
  messaging jsonb DEFAULT '{}',
  guidelines jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;

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

-- Add triggers for updated_at
CREATE TRIGGER update_visual_assets_updated_at
  BEFORE UPDATE ON visual_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_voice_updated_at
  BEFORE UPDATE ON brand_voice
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();