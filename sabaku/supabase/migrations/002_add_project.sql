-- Add project field for lightweight grouping
ALTER TABLE strips ADD COLUMN project TEXT;
CREATE INDEX idx_strips_user_project ON strips(user_id, project) WHERE project IS NOT NULL;
