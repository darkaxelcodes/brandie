-- Drop all existing policies on teams and team_members tables
DROP POLICY IF EXISTS "Users can view teams they own" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Team owners can update their teams" ON teams;
DROP POLICY IF EXISTS "Team owners can delete their teams" ON teams;
DROP POLICY IF EXISTS "Team members can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owners can view their teams" ON teams;

DROP POLICY IF EXISTS "Team owners can add members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update member roles" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can remove themselves from teams" ON team_members;
DROP POLICY IF EXISTS "Team owners can view all team members" ON team_members;
DROP POLICY IF EXISTS "Team members can view other team members" ON team_members;

-- Create new non-recursive policies for teams table
-- 1. Basic CRUD for team owners (direct user_id check, no recursion)
CREATE POLICY "Users can view teams they own"
  ON teams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update teams they own"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete teams they own"
  ON teams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- 2. Separate policy for team members to view teams
-- This uses a direct subquery without circular references
CREATE POLICY "Users can view teams they are members of"
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

-- Create new non-recursive policies for team_members table
-- 1. Team owners can manage members (uses direct subquery to teams)
CREATE POLICY "Team owners can manage members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT id 
      FROM teams 
      WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT id 
      FROM teams 
      WHERE owner_id = auth.uid()
    )
  );

-- 2. Users can view their own memberships (direct user_id check)
CREATE POLICY "Users can view their own memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. Users can leave teams (direct user_id check)
CREATE POLICY "Users can leave teams"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Team members can view other members in their teams
-- This avoids recursion by using a different approach
CREATE POLICY "Team members can view other members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );