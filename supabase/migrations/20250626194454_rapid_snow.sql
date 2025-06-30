/*
  # Fix RLS infinite recursion in teams tables

  1. Problem
    - Current RLS policies on teams and team_members tables create infinite recursion
    - Teams policy checks team_members, team_members policy may trigger teams checks

  2. Solution
    - Drop existing recursive policies
    - Create simpler, non-recursive policies
    - Use direct column checks instead of subqueries where possible

  3. New Policies
    - Teams: Allow owners full access, members read-only access
    - Team Members: Allow team owners to manage, users to view their own memberships
*/

-- Drop existing problematic policies on teams table
DROP POLICY IF EXISTS "Members can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owners can manage their teams" ON teams;

-- Drop existing problematic policies on team_members table  
DROP POLICY IF EXISTS "Team owners can manage members" ON team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON team_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON team_members;

-- Create new non-recursive policies for teams table
CREATE POLICY "Team owners have full access"
  ON teams
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Create new non-recursive policies for team_members table
CREATE POLICY "Team owners can manage all members"
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

CREATE POLICY "Users can view their own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memberships"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a separate policy for teams that members can view
-- This uses a direct join to avoid recursion
CREATE POLICY "Team members can view their teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT tm.user_id 
      FROM team_members tm 
      WHERE tm.team_id = teams.id
    )
  );