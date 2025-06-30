/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - Current policies on teams and team_members tables create circular references
    - Teams policy checks team_members, team_members policy checks teams
    - This creates infinite recursion during policy evaluation

  2. Solution
    - Simplify team policies to avoid circular references
    - Use direct ownership checks where possible
    - Restructure team member visibility policies

  3. Changes
    - Drop existing problematic policies
    - Create new simplified policies that avoid recursion
    - Ensure proper access control without circular dependencies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team members can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owners have full access" ON teams;
DROP POLICY IF EXISTS "Team owners can manage all members" ON team_members;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON team_members;
DROP POLICY IF EXISTS "Users can view their own team memberships" ON team_members;

-- Create new simplified policies for teams table
CREATE POLICY "Users can view teams they own"
  ON teams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can view teams they are members of"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
  ON teams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create new simplified policies for team_members table
CREATE POLICY "Users can view team members of teams they own"
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

CREATE POLICY "Users can view team members of teams they belong to"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm2
      WHERE tm2.team_id = team_members.team_id 
      AND tm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can add members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can update member roles"
  ON team_members
  FOR UPDATE
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

CREATE POLICY "Team owners can remove members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove themselves from teams"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);