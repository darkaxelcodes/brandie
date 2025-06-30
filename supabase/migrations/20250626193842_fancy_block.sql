/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - The existing RLS policies on team_members table are causing infinite recursion
    - The policy "Users can view team members of joined teams" creates a circular dependency
    - When querying team_members, it tries to check team_members again, causing infinite loop

  2. Solution
    - Drop the problematic policies
    - Create new, simpler policies that avoid circular references
    - Use direct user_id checks and team ownership checks instead of subqueries on the same table

  3. New Policies
    - Users can view their own team memberships
    - Team owners can view all members of their teams
    - Team owners can manage all members of their teams
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team owners can manage members" ON team_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON team_members;
DROP POLICY IF EXISTS "Users can view team members of joined teams" ON team_members;

-- Create new, safe policies

-- Policy 1: Users can view their own memberships
CREATE POLICY "Users can view own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Team owners can view all members of their teams
CREATE POLICY "Team owners can view team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- Policy 3: Team owners can manage (insert/update/delete) members of their teams
CREATE POLICY "Team owners can manage team members"
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

-- Policy 4: Users can delete their own memberships (leave teams)
CREATE POLICY "Users can leave teams"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);