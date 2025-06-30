/*
  # Team Collaboration RLS Policies
  
  This migration adds RLS policies for team collaboration tables.
  The policies are carefully designed to avoid infinite recursion.
*/

-- Teams policies
CREATE POLICY "Users can manage their own teams"
  ON teams
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view teams they belong to"
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

-- Team members policies
CREATE POLICY "Users can view their own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Team owners can view all team members"
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

CREATE POLICY "Team owners can insert team members"
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

CREATE POLICY "Team owners can update team members"
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

CREATE POLICY "Team owners can delete team members"
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

CREATE POLICY "Users can delete their own memberships"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Brand permissions policies
CREATE POLICY "Brand owners can manage permissions"
  ON brand_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_permissions.brand_id 
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_permissions.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view permissions"
  ON brand_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = brand_permissions.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments on owned brands"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = comments.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view comments on shared brands"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brand_permissions bp
      JOIN team_members tm ON tm.team_id = bp.team_id
      WHERE bp.brand_id = comments.brand_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments on accessible brands"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (
        SELECT 1 FROM brands 
        WHERE brands.id = comments.brand_id 
        AND brands.user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM brand_permissions bp
        JOIN team_members tm ON tm.team_id = bp.team_id
        WHERE bp.brand_id = comments.brand_id 
        AND tm.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage their own comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view activity for owned brands"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = activity_log.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view activity for shared brands"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brand_permissions bp
      JOIN team_members tm ON tm.team_id = bp.team_id
      WHERE bp.brand_id = activity_log.brand_id 
      AND tm.user_id = auth.uid()
    )
  );