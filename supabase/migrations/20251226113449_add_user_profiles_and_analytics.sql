/*
  # Add User Profiles and Analytics Events Tables

  ## Summary
  This migration creates two new tables to support user onboarding, profile management,
  and analytics event tracking for the Brandie feedback loop system.

  ## 1. New Tables

  ### `user_profiles`
  Stores extended user information collected during onboarding and profile completion.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, unique, references auth.users) - Link to authenticated user
  - `full_name` (text) - User's full name
  - `company_name` (text) - Company or organization name
  - `company_website` (text) - Company website URL
  - `role` (text) - User's role (founder, designer, marketer, developer, agency, other)
  - `company_size` (text) - Company size category (solo, 2-10, 11-50, 51-200, 200+)
  - `industry` (text) - Industry category
  - `goals` (text[]) - Array of goals (brand_identity, marketing_assets, guidelines, website)
  - `referral_source` (text) - How user found Brandie
  - `onboarding_completed_at` (timestamptz) - When onboarding was completed
  - `onboarding_skipped_at` (timestamptz) - When onboarding was skipped
  - `profile_completion_rewarded` (boolean) - Whether token reward was given
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### `analytics_events`
  Stores server-side analytics events for data ownership and backup.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, references auth.users) - User who triggered the event
  - `brand_id` (uuid, references brands) - Associated brand if applicable
  - `event_name` (text) - Event name (e.g., color_selected, logo_generated)
  - `event_category` (text) - Category (design, brand, ai, export, onboarding)
  - `event_properties` (jsonb) - Additional event data
  - `created_at` (timestamptz) - Event timestamp

  ## 2. Security
  - RLS enabled on both tables
  - Users can only read/write their own profile data
  - Users can only read their own analytics events
  - Analytics events are insert-only for users (no updates/deletes)

  ## 3. Indexes
  - Index on user_id for fast profile lookups
  - Index on user_id and created_at for analytics queries
  - Index on event_category for filtering
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text,
  company_name text,
  company_website text,
  role text,
  company_size text,
  industry text,
  goals text[] DEFAULT '{}',
  referral_source text,
  onboarding_completed_at timestamptz,
  onboarding_skipped_at timestamptz,
  profile_completion_rewarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  brand_id uuid,
  event_name text NOT NULL,
  event_category text NOT NULL,
  event_properties jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics events policies (insert-only for users, read own)
CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();
