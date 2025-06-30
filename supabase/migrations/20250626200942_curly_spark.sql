/*
  # Add Industry Classification to Brands

  1. New Fields
    - Add `industry` text field to brands table
    - Add `industry_details` jsonb field for additional industry-specific data

  2. Changes
    - Update brands table with new fields
    - Create index for faster industry-based queries
*/

-- Add industry fields to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS industry_details JSONB DEFAULT '{}';

-- Create index for faster industry-based queries
CREATE INDEX IF NOT EXISTS idx_brands_industry ON brands(industry);

-- Create industry suggestions table for AI recommendations
CREATE TABLE IF NOT EXISTS industry_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  suggestion_type TEXT NOT NULL,
  content JSONB NOT NULL,
  relevance INTEGER DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on industry_suggestions
ALTER TABLE industry_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policy for reading industry suggestions
CREATE POLICY "Anyone can read industry suggestions"
  ON industry_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_industry_suggestions_updated_at
  BEFORE UPDATE ON industry_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster suggestion lookups
CREATE INDEX IF NOT EXISTS idx_industry_suggestions_industry ON industry_suggestions(industry);
CREATE INDEX IF NOT EXISTS idx_industry_suggestions_type ON industry_suggestions(suggestion_type);