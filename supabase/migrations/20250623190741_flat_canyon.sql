/*
  # UI/UX Improvements and Performance Optimizations

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `theme` (text)
      - `keyboard_shortcuts_enabled` (boolean)
      - `reduced_motion` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on user_preferences table
    - Add policies for authenticated users to manage their own preferences
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme text DEFAULT 'light',
  keyboard_shortcuts_enabled boolean DEFAULT true,
  reduced_motion boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_usage_brand_id ON template_usage(brand_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_type ON template_usage(template_type);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_brand_id ON compliance_checks(brand_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_score ON compliance_checks(score);
CREATE INDEX IF NOT EXISTS idx_visual_assets_brand_id_asset_type ON visual_assets(brand_id, asset_type);