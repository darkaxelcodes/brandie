/*
  # Add Brand Health Table

  1. New Tables
    - `brand_health_scores`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `overall_score` (integer)
      - `completeness_score` (integer)
      - `consistency_score` (integer)
      - `uniqueness_score` (integer)
      - `relevance_score` (integer)
      - `details` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on brand_health_scores table
    - Add policies for authenticated users to manage their own health scores
*/

-- Create brand_health_scores table
CREATE TABLE IF NOT EXISTS brand_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  overall_score integer NOT NULL,
  completeness_score integer NOT NULL,
  consistency_score integer NOT NULL,
  uniqueness_score integer NOT NULL,
  relevance_score integer NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_health_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own brand health scores"
  ON brand_health_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_health_scores.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_health_scores.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_brand_health_scores_brand_id ON brand_health_scores(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_health_scores_created_at ON brand_health_scores(created_at);