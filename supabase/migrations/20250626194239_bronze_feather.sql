/*
  # Fix infinite recursion in team RLS policies

  1. Policy Updates
    - Remove recursive policies on teams and team_members tables
    - Create non-recursive policies that avoid circular references
    - Ensure proper access control without infinite loops

  2. Security
    - Team owners can manage their teams
    - Team members can view teams they belong to
    - Team owners can manage team members
    - Users can view their own team memberships
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can manage their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team owners can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON team_members;
DROP POLICY IF EXISTS "Users can view own team memberships" ON team_members;

-- Create new non-recursive policies for teams table
CREATE POLICY "Team owners can manage their teams"
  ON teams
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Create new non-recursive policies for team_members table
CREATE POLICY "Team owners can manage members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add a separate policy for team members to view teams they belong to
CREATE POLICY "Members can view their teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );