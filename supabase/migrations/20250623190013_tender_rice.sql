/*
  # Brand Consistency Updates

  1. New Features
    - Add version tracking for visual assets
    - Add template usage tracking
    - Add compliance check history

  2. Changes
    - Add version field to visual_assets table
    - Create template_usage table
    - Create compliance_checks table
*/

-- Add version tracking to visual assets
ALTER TABLE visual_assets ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE visual_assets ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]';

-- Create template usage tracking table
CREATE TABLE IF NOT EXISTS template_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  template_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create compliance checks history table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for template_usage
CREATE POLICY "Users can manage own template usage"
  ON template_usage
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = template_usage.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = template_usage.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Add RLS policies for compliance_checks
CREATE POLICY "Users can manage own compliance checks"
  ON compliance_checks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = compliance_checks.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = compliance_checks.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_template_usage_updated_at
  BEFORE UPDATE ON template_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();