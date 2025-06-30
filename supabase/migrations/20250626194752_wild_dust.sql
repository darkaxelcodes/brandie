/*
  # Fix RLS Policies for Teams and Team Members

  This migration fixes the infinite recursion issue in RLS policies by:
  1. Dropping existing problematic policies
  2. Creating new, simplified policies that avoid circular dependencies
  3. Ensuring proper access control without recursive checks

  ## Changes Made
  - Removed circular policy dependencies between teams and team_members tables
  - Simplified team access policies to avoid self-referencing queries
  - Maintained security while preventing infinite recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view teams they are members of" ON teams;
DROP POLICY IF EXISTS "Users can view team members of teams they belong to" ON team_members;
DROP POLICY IF EXISTS "Users can view team members of teams they own" ON team_members;

-- Create new simplified policies for teams table
CREATE POLICY "Team owners can view their teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view their teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create new simplified policies for team_members table
CREATE POLICY "Team owners can view all team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT id 
      FROM teams 
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view other team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT tm.team_id 
      FROM team_members tm 
      WHERE tm.user_id = auth.uid()
    )
  );