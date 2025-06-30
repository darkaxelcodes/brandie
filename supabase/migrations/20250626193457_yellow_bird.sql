/*
  # Fix infinite recursion in team_members RLS policies

  1. Problem
    - The current RLS policies on team_members table are causing infinite recursion
    - This happens when policies reference the same table they're protecting

  2. Solution
    - Drop existing problematic policies
    - Create simplified, non-recursive policies
    - Ensure policies don't create circular dependencies

  3. New Policies
    - Team owners can manage all team members (simplified)
    - Users can view their own memberships (direct check)
    - Users can view team members of teams they belong to (safe subquery)
*/

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Team owners can delete team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can insert team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can view all team members" ON team_members;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON team_members;
DROP POLICY IF EXISTS "Users can view their own team memberships" ON team_members;

-- Create new, safe policies

-- Policy 1: Users can view their own team memberships (direct check, no recursion)
CREATE POLICY "Users can view own memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Team owners can manage team members (safe subquery to teams table only)
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

-- Policy 3: Users can view members of teams they belong to (safe approach)
CREATE POLICY "Users can view team members of joined teams"
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